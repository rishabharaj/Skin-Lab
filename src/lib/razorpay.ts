// ============================================
// RAZORPAY PAYMENT UTILITY
// ============================================
// This module handles the Razorpay Checkout integration.
//
// ACTIVATION STEPS:
// 1. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET secrets in your deployment environment
// 2. Set RAZORPAY_ENABLED = true below
// 3. The payment flow will automatically activate
//
// HOW IT WORKS:
// 1. User clicks "Pay" → createRazorpayOrder() calls edge function
// 2. Edge function creates order via Razorpay API → returns order_id + key
// 3. openRazorpayCheckout() opens the Razorpay payment modal
// 4. After payment → verifyRazorpayPayment() calls edge function
// 5. Edge function verifies signature → updates order status to "confirmed"
// ============================================

import { supabase } from "@/integrations/supabase/client";

// ============================================
// 🔧 TOGGLE THIS TO ENABLE/DISABLE RAZORPAY
// Set to true once you've added RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET
// ============================================
export const RAZORPAY_ENABLED = false;

/**
 * Load Razorpay checkout script dynamically
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Step 1: Create a Razorpay order via edge function
 */
export const createRazorpayOrder = async (
  amount: number,
  receipt: string,
  notes?: Record<string, string>
): Promise<{ order_id: string; key_id: string; amount: number; currency: string } | null> => {
  try {
    const { data, error } = await supabase.functions.invoke("create-razorpay-order", {
      body: { amount, currency: "INR", receipt, notes },
    });

    if (error || !data?.success) {
      console.error("Razorpay order creation failed:", error || data?.error);
      return null;
    }

    return {
      order_id: data.order_id,
      key_id: data.key_id,
      amount: data.amount,
      currency: data.currency,
    };
  } catch (err) {
    console.error("createRazorpayOrder error:", err);
    return null;
  }
};

/**
 * Step 2: Open Razorpay Checkout modal
 */
export const openRazorpayCheckout = (options: {
  key_id: string;
  order_id: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  prefill: { name: string; email: string; contact: string };
  onSuccess: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void;
  onDismiss: () => void;
}): void => {
  const rzp = new (window as any).Razorpay({
    key: options.key_id,
    amount: options.amount,
    currency: options.currency,
    name: options.name,
    description: options.description,
    order_id: options.order_id,
    prefill: options.prefill,
    theme: { color: "#000000" },
    handler: (response: any) => {
      options.onSuccess({
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
      });
    },
    modal: {
      ondismiss: options.onDismiss,
    },
  });
  rzp.open();
};

/**
 * Step 3: Verify payment signature via edge function
 */
export const verifyRazorpayPayment = async (params: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  order_id: string; // Our internal order UUID
}): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke("verify-razorpay-payment", {
      body: params,
    });

    if (error || !data?.success) {
      console.error("Payment verification failed:", error || data?.error);
      return false;
    }

    return data.verified === true;
  } catch (err) {
    console.error("verifyRazorpayPayment error:", err);
    return false;
  }
};
