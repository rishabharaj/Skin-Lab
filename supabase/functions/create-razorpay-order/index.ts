import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// ============================================
// RAZORPAY ORDER CREATION — Edge Function
// ============================================
// This function creates a Razorpay order on the backend.
//
// SETUP:
// 1. Add these secrets in your environment/secrets manager:
//    - RAZORPAY_KEY_ID     (from Razorpay Dashboard > Settings > API Keys)
//    - RAZORPAY_KEY_SECRET (from Razorpay Dashboard > Settings > API Keys)
//
// 2. Once secrets are added, this function is ready to use.
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
    const RAZORPAY_KEY_ID = Deno.env.get('RAZORPAY_KEY_ID');
    const RAZORPAY_KEY_SECRET = Deno.env.get('RAZORPAY_KEY_SECRET');

    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      console.error('Razorpay credentials not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Payment gateway not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { amount, currency, receipt, notes } = await req.json();

    if (!amount || amount <= 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid amount' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ============================================
    // RAZORPAY ORDER CREATION
    // Amount must be in paise (1 INR = 100 paise)
    // ============================================
    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`),
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Convert to paise
        currency: currency || 'INR',
        receipt: receipt || `rcpt_${Date.now()}`,
        notes: notes || {},
      }),
    });

    const result = await razorpayResponse.json();

    if (!razorpayResponse.ok) {
      console.error('Razorpay API error:', JSON.stringify(result));
      return new Response(
        JSON.stringify({ success: false, error: result.error?.description || 'Failed to create Razorpay order' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Razorpay order created:', result.id);

    return new Response(
      JSON.stringify({
        success: true,
        order_id: result.id,
        amount: result.amount,
        currency: result.currency,
        key_id: RAZORPAY_KEY_ID, // Public key safe to send to frontend
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in create-razorpay-order:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
