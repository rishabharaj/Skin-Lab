import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const WHATSAPP_TOKEN = Deno.env.get('WHATSAPP_ACCESS_TOKEN');
    const PHONE_NUMBER_ID = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID');

    if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
      console.error('WhatsApp credentials not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'WhatsApp not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { type, data } = await req.json();
    const useTemplates = data.useTemplates !== false; // Default to templates

    let messagePayload: Record<string, any> = {};

    if (type === 'order_placed') {
      const { orderNumber, customerName, total, items, deliveryEstimate, shippingAddress } = data;

      if (useTemplates) {
        // ============================================
        // TEMPLATE MESSAGE — Better delivery rates
        // Create this template in Meta Business Manager:
        // Template name: "order_confirmation"
        // Language: "en"
        // Body: "Hi {{1}}, your order {{2}} has been placed! Total: ₹{{3}}. Estimated delivery: {{4}}. Thank you for shopping with SkinLab! 🎉"
        // ============================================
        messagePayload = {
          type: 'template',
          template: {
            name: 'order_confirmation',
            language: { code: 'en' },
            components: [
              {
                type: 'body',
                parameters: [
                  { type: 'text', text: customerName || 'Customer' },
                  { type: 'text', text: orderNumber || 'N/A' },
                  { type: 'text', text: String(total || 0) },
                  { type: 'text', text: deliveryEstimate || '2-4 days' },
                ],
              },
            ],
          },
        };
      } else {
        // Fallback: plain text (works only within 24hr window)
        const itemsList = (items || [])
          .map((item: any) => `• ${item.skin_name} for ${item.device_name} (${item.coverage}) x${item.quantity} — ₹${item.price * item.quantity}`)
          .join('\n');

        messagePayload = {
          type: 'text',
          text: {
            body: `🎉 *Order Confirmed!*\n\nHi ${customerName},\nYour order *${orderNumber}* has been placed successfully!\n\n📦 *Items:*\n${itemsList}\n\n💰 *Total:* ₹${total}\n🚚 *Estimated Delivery:* ${deliveryEstimate || '2-4 days'}\n📍 *Shipping To:* ${shippingAddress || 'N/A'}\n\nThank you for shopping with SkinLab! 🙏`,
          },
        };
      }

    } else if (type === 'status_update') {
      const { orderNumber, customerName, newStatus, deliveryEstimate } = data;

      if (useTemplates) {
        // ============================================
        // TEMPLATE MESSAGE for status updates
        // Create this template in Meta Business Manager:
        // Template name: "order_status_update"
        // Language: "en"
        // Body: "Hi {{1}}, your order {{2}} status is now: {{3}}. {{4}} Thank you for choosing SkinLab!"
        // ============================================
        messagePayload = {
          type: 'template',
          template: {
            name: 'order_status_update',
            language: { code: 'en' },
            components: [
              {
                type: 'body',
                parameters: [
                  { type: 'text', text: customerName || 'Customer' },
                  { type: 'text', text: orderNumber || 'N/A' },
                  { type: 'text', text: (newStatus || 'updated').toUpperCase() },
                  { type: 'text', text: deliveryEstimate ? `Estimated delivery: ${deliveryEstimate}.` : '' },
                ],
              },
            ],
          },
        };
      } else {
        const statusEmoji: Record<string, string> = {
          confirmed: '✅', processing: '⏳', shipped: '🚚', delivered: '📦', cancelled: '❌',
        };
        messagePayload = {
          type: 'text',
          text: {
            body: `${statusEmoji[newStatus] || '📋'} *Order Update*\n\nHi ${customerName},\nYour order *${orderNumber}* status has been updated to: *${newStatus.toUpperCase()}*\n${deliveryEstimate ? `🕐 *Estimated Delivery:* ${deliveryEstimate}\n` : ''}\nThank you for choosing SkinLab! 🙏`,
          },
        };
      }

    } else {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid message type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Send via WhatsApp Business API
    const customerPhone = data.customerPhone;
    if (!customerPhone) {
      return new Response(
        JSON.stringify({ success: false, error: 'No customer phone number provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Clean phone number
    let cleanPhone = customerPhone.replace(/[\s\-\(\)]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '91' + cleanPhone.substring(1);
    }
    if (!cleanPhone.startsWith('+') && !cleanPhone.startsWith('91')) {
      cleanPhone = '91' + cleanPhone;
    }
    cleanPhone = cleanPhone.replace('+', '');

    const whatsappResponse = await fetch(
      `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: cleanPhone,
          ...messagePayload,
        }),
      }
    );

    const result = await whatsappResponse.json();

    if (!whatsappResponse.ok) {
      console.error('WhatsApp API error:', JSON.stringify(result));
      return new Response(
        JSON.stringify({ success: false, error: `WhatsApp API failed [${whatsappResponse.status}]: ${JSON.stringify(result)}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('WhatsApp message sent successfully:', JSON.stringify(result));

    return new Response(
      JSON.stringify({ success: true, messageId: result.messages?.[0]?.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-whatsapp function:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
