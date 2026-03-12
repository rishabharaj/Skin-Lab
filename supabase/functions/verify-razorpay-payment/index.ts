import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ============================================
// RAZORPAY PAYMENT VERIFICATION — Edge Function
// ============================================
// This function verifies Razorpay payment signatures.
// After successful verification, it updates the order with payment details.
//
// VERIFICATION FLOW:
// 1. Frontend sends razorpay_order_id, razorpay_payment_id, razorpay_signature
// 2. Backend generates expected signature using HMAC-SHA256
// 3. If signatures match → payment is genuine → order confirmed
// 4. If mismatch → payment is tampered → order rejected
// ============================================

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RAZORPAY_KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET');

    if (!RAZORPAY_KEY_SECRET) {
      return new Response(
        JSON.stringify({ success: false, error: 'Payment gateway not configured' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      order_id, // Our internal order UUID
    } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !order_id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required payment details' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ============================================
    // SIGNATURE VERIFICATION using HMAC-SHA256
    // Expected signature = HMAC_SHA256(razorpay_order_id + "|" + razorpay_payment_id, secret)
    // ============================================
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(RAZORPAY_KEY_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const message = `${razorpay_order_id}|${razorpay_payment_id}`;
    const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    const isValid = expectedSignature === razorpay_signature;

    // Initialize Supabase admin client to update order
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (isValid) {
      // ✅ Payment verified — update order
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          payment_id: razorpay_payment_id,
          payment_order_id: razorpay_order_id,
          payment_signature: razorpay_signature,
          payment_status: 'paid',
          status: 'confirmed',
          payment_method: 'razorpay',
          status_updated_at: new Date().toISOString(),
        })
        .eq('id', order_id);

      if (updateError) {
        console.error('Order update error:', updateError);
        return new Response(
          JSON.stringify({ success: false, error: 'Payment verified but failed to update order' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`Payment verified for order ${order_id}, payment ${razorpay_payment_id}`);

      return new Response(
        JSON.stringify({ success: true, verified: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      // ❌ Signature mismatch — possible tampering
      await supabase
        .from('orders')
        .update({
          payment_status: 'failed',
          payment_order_id: razorpay_order_id,
          status_updated_at: new Date().toISOString(),
        })
        .eq('id', order_id);

      console.error(`Payment verification FAILED for order ${order_id}`);

      return new Response(
        JSON.stringify({ success: false, verified: false, error: 'Payment signature verification failed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Error in verify-razorpay-payment:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
