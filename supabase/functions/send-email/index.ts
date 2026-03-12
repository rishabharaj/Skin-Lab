import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type OrderItem = {
  skin_name: string;
  device_name: string;
  coverage: string;
  quantity: number;
  price: number;
};

type OrderPlacedData = {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  deliveryEstimate: string;
  shippingAddress: string;
};

type StatusUpdateData = {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  newStatus: string;
  deliveryEstimate?: string;
};

function money(n: number) {
  return `₹${Number.isFinite(n) ? n.toFixed(0) : "0"}`;
}

function orderConfirmationTemplate(data: OrderPlacedData): string {
  const itemsHtml = data.items
    .map(
      (item) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">
            <div style="font-weight:700;color:#111;">${item.skin_name}</div>
            <div style="color:#666;font-size:13px;">${item.device_name} · ${item.coverage} · x${item.quantity}</div>
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:700;color:#111;">
            ${money(item.price * item.quantity)}
          </td>
        </tr>
      `,
    )
    .join("");

  const discountRow =
    data.discount > 0
      ? `
        <tr>
          <td style="padding:6px 0;color:#16a34a;">Discount</td>
          <td style="padding:6px 0;text-align:right;color:#16a34a;">-${money(data.discount)}</td>
        </tr>
      `
      : "";

  const shippingValue = data.shipping === 0 ? "Free" : money(data.shipping);

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <title>Order Confirmed</title>
  </head>
  <body style="margin:0;padding:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 16px;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;max-width:600px;">
            <tr>
              <td style="background:#000;padding:28px 36px;text-align:center;">
                <div style="font-size:26px;font-weight:900;letter-spacing:-1px;color:#fff;">SKIN<span style="color:#a3e635;">LAB</span></div>
                <div style="margin-top:6px;color:#aaa;font-size:13px;">Premium Device Skins</div>
              </td>
            </tr>
            <tr>
              <td style="padding:34px 36px;">
                <h2 style="margin:0 0 8px;font-size:20px;color:#111;">Order Confirmed! 🎉</h2>
                <p style="margin:0 0 18px;color:#555;font-size:14px;">Hi <strong>${data.customerName}</strong>, your order has been placed successfully.</p>

                <div style="background:#f8f8f8;border-radius:12px;padding:14px 16px;margin:0 0 18px;">
                  <div style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;">Order Number</div>
                  <div style="margin-top:4px;font-family:monospace;font-size:18px;font-weight:800;color:#111;">${data.orderNumber}</div>
                </div>

                <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 18px;">
                  ${itemsHtml}
                </table>

                <table width="100%" cellpadding="0" cellspacing="0" style="border-top:2px solid #f0f0f0;padding-top:12px;">
                  <tr>
                    <td style="padding:6px 0;color:#555;">Subtotal</td>
                    <td style="padding:6px 0;text-align:right;color:#555;">${money(data.subtotal)}</td>
                  </tr>
                  ${discountRow}
                  <tr>
                    <td style="padding:6px 0;color:#555;">GST</td>
                    <td style="padding:6px 0;text-align:right;color:#555;">${money(data.tax)}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#555;">Shipping</td>
                    <td style="padding:6px 0;text-align:right;color:#555;">${shippingValue}</td>
                  </tr>
                  <tr style="border-top:1px solid #f0f0f0;">
                    <td style="padding:12px 0 0;font-weight:800;color:#111;">Total</td>
                    <td style="padding:12px 0 0;text-align:right;font-weight:900;color:#111;font-size:18px;">${money(data.total)}</td>
                  </tr>
                </table>

                <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:14px 16px;margin:18px 0 0;">
                  <div style="font-size:13px;color:#16a34a;font-weight:800;">🚚 Estimated Delivery: ${data.deliveryEstimate}</div>
                  <div style="margin-top:6px;color:#555;font-size:13px;">${data.shippingAddress}</div>
                </div>

                <p style="margin:18px 0 0;color:#888;font-size:12px;text-align:center;">Thank you for choosing SkinLab! 🙏</p>
              </td>
            </tr>
            <tr>
              <td style="background:#f5f5f5;padding:18px 36px;text-align:center;">
                <div style="color:#aaa;font-size:12px;">SkinLab · Premium Device Skins · India</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function orderStatusTemplate(data: StatusUpdateData): string {
  const statusEmoji: Record<string, string> = {
    confirmed: "✅",
    processing: "⏳",
    shipped: "🚚",
    delivered: "📦",
    cancelled: "❌",
  };
  const emoji = statusEmoji[data.newStatus] || "📋";

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <title>Status Updated</title>
  </head>
  <body style="margin:0;padding:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 16px;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;max-width:600px;">
            <tr>
              <td style="background:#000;padding:28px 36px;text-align:center;">
                <div style="font-size:26px;font-weight:900;letter-spacing:-1px;color:#fff;">SKIN<span style="color:#a3e635;">LAB</span></div>
              </td>
            </tr>
            <tr>
              <td style="padding:34px 36px;text-align:center;">
                <div style="font-size:44px;line-height:1;margin-bottom:12px;">${emoji}</div>
                <h2 style="margin:0 0 8px;font-size:20px;color:#111;">Order Status Updated</h2>
                <p style="margin:0 0 18px;color:#555;font-size:14px;">Hi <strong>${data.customerName}</strong>, your order status has changed.</p>

                <div style="background:#f8f8f8;border-radius:12px;padding:14px 16px;display:inline-block;min-width:240px;">
                  <div style="font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;">Order</div>
                  <div style="margin-top:4px;font-family:monospace;font-size:16px;font-weight:800;color:#111;">${data.orderNumber}</div>
                  <div style="margin-top:10px;font-size:12px;color:#888;">New Status</div>
                  <div style="margin-top:4px;font-size:18px;font-weight:900;color:#111;text-transform:capitalize;">${data.newStatus}</div>
                </div>

                ${data.deliveryEstimate ? `<p style="margin:16px 0 0;color:#555;font-size:13px;">🕐 Estimated Delivery: <strong>${data.deliveryEstimate}</strong></p>` : ""}

                <p style="margin:18px 0 0;color:#888;font-size:12px;">Thank you for choosing SkinLab! 🙏</p>
              </td>
            </tr>
            <tr>
              <td style="background:#f5f5f5;padding:18px 36px;text-align:center;">
                <div style="color:#aaa;font-size:12px;">SkinLab · Premium Device Skins · India</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

async function sendViaResend(args: {
  to: string;
  from: string;
  subject: string;
  html: string;
  apiKey: string;
}) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${args.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: args.from,
      to: [args.to],
      subject: args.subject,
      html: args.html,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `Resend API error [${response.status}]: ${JSON.stringify(data)}`,
    );
  }

  return data;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")?.trim();

    if (!RESEND_API_KEY) {
      console.error("Missing RESEND_API_KEY");
      return new Response(
        JSON.stringify({
          success: false,
          error: "RESEND_API_KEY not configured",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const body = (await req.json().catch(() => null)) as
      | { type?: string; data?: Record<string, unknown> }
      | null;

    const type = body?.type;
    const data = body?.data as Record<string, unknown> | undefined;

    if (!type || !data) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid payload" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const customerEmail = String(data.customerEmail ?? "").trim();
    const customerName = String(data.customerName ?? "Customer").trim() ||
      "Customer";
    const orderNumber = String(data.orderNumber ?? "").trim();

    if (!customerEmail) {
      return new Response(
        JSON.stringify({ success: false, error: "No customerEmail provided" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    let subject = "";
    let html = "";

    if (type === "order_placed") {
      subject = `Order Confirmed! ${orderNumber || ""} — SkinLab`.trim();
      html = orderConfirmationTemplate({
        customerEmail,
        customerName,
        orderNumber,
        items: Array.isArray(data.items) ? (data.items as OrderItem[]) : [],
        subtotal: Number(data.subtotal ?? 0),
        discount: Number(data.discount ?? 0),
        tax: Number(data.tax ?? 0),
        shipping: Number(data.shipping ?? 0),
        total: Number(data.total ?? 0),
        deliveryEstimate: String(data.deliveryEstimate ?? ""),
        shippingAddress: String(data.shippingAddress ?? ""),
      });
    } else if (type === "status_update") {
      subject = `Order ${orderNumber || ""} — Status Updated`.trim();
      html = orderStatusTemplate({
        customerEmail,
        customerName,
        orderNumber,
        newStatus: String(data.newStatus ?? "updated"),
        deliveryEstimate: data.deliveryEstimate
          ? String(data.deliveryEstimate)
          : undefined,
      });
    } else {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid type" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const result = await sendViaResend({
      to: customerEmail,
      from: "SkinLab <onboarding@resend.dev>",
      subject,
      html,
      apiKey: RESEND_API_KEY,
    });

    console.log("Email sent successfully:", result);

    return new Response(
      JSON.stringify({ success: true, emailId: result.id }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("send-email error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
