import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { ChevronRight, Lock, CreditCard, Truck, ArrowLeft, CheckCircle2, Tag, X, Loader2, Clock } from "lucide-react";
import { toast } from "sonner";
import {
  RAZORPAY_ENABLED,
  // loadRazorpayScript,
  // createRazorpayOrder,
  // openRazorpayCheckout,
  // verifyRazorpayPayment,
} from "@/lib/razorpay";

const CHECKOUT_DRAFT_KEY = "skinlab_checkout_draft_v1";

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<"address" | "payment" | "confirmation">("address");
  const [orderNumber, setOrderNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    apartment: "",
    city: "Indore",
    state: "Madhya Pradesh",
    country: "India",
    postalCode: "",
  });
  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    postalCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi">("upi");
  const [cardForm, setCardForm] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{ id: string; code: string; discount_percent: number } | null>(null);
  const [couponError, setCouponError] = useState("");

  // Restore saved checkout progress after OAuth redirect/login refresh.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(CHECKOUT_DRAFT_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw) as {
        step?: "address" | "payment";
        form?: typeof form;
        paymentMethod?: "card" | "upi";
        cardForm?: typeof cardForm;
        couponCode?: string;
      };

      if (draft.step === "address" || draft.step === "payment") setStep(draft.step);
      if (draft.form) setForm((prev) => ({ ...prev, ...draft.form }));
      if (draft.paymentMethod) setPaymentMethod(draft.paymentMethod);
      if (draft.cardForm) setCardForm((prev) => ({ ...prev, ...draft.cardForm }));
      if (draft.couponCode) setCouponCode(draft.couponCode);
    } catch {
      // Ignore malformed local draft.
    }
  }, []);

  const shipping = totalPrice >= 999 ? 0 : 99;
  const tax = totalPrice * 0.18; // GST 18%
  const discount = appliedCoupon ? totalPrice * (appliedCoupon.discount_percent / 100) : 0;
  const total = totalPrice - discount + shipping + tax;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login?redirect=/checkout", { replace: true });
    }
  }, [user, authLoading, navigate]);

  // Pre-fill email from user
  useEffect(() => {
    if (user?.email && !form.email) {
      setForm((prev) => ({ ...prev, email: user.email || "" }));
    }
    if (user?.user_metadata?.full_name && !form.firstName) {
      const parts = (user.user_metadata.full_name as string).split(" ");
      setForm((prev) => ({
        ...prev,
        firstName: parts[0] || "",
        lastName: parts.slice(1).join(" ") || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (step === "confirmation") return;
    window.localStorage.setItem(
      CHECKOUT_DRAFT_KEY,
      JSON.stringify({ step, form, paymentMethod, cardForm, couponCode })
    );
  }, [step, form, paymentMethod, cardForm, couponCode]);

  // Coupon apply handler
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError("");

    try {
      // Check if coupon exists and is active
      const { data: coupon, error } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", couponCode.trim().toUpperCase())
        .eq("is_active", true)
        .single();

      if (error || !coupon) {
        setCouponError("Invalid or expired coupon code");
        setCouponLoading(false);
        return;
      }

      // Check max uses
      if (coupon.times_used >= coupon.max_uses) {
        setCouponError("This coupon has reached its maximum usage limit");
        setCouponLoading(false);
        return;
      }

      // Same user can use many different coupons, but not the same coupon twice
      if (user) {
        const { data: existingUsage } = await supabase
          .from("coupon_usages")
          .select("id")
          .eq("user_id", user.id)
          .eq("coupon_id", coupon.id)
          .maybeSingle();

        if (existingUsage) {
          setCouponError("You have already used this coupon on your account.");
          setCouponLoading(false);
          return;
        }
      }

      setAppliedCoupon({ id: coupon.id, code: coupon.code, discount_percent: coupon.discount_percent });
      toast.success(`Coupon applied! ${coupon.discount_percent}% off`);
    } catch {
      setCouponError("Failed to validate coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const validateForm = () => {
    const errors = {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      street: "",
      postalCode: "",
    };

    // Name validation - min 2 chars, no numbers
    if (!form.firstName.trim() || form.firstName.length < 2) {
      errors.firstName = "First name must be at least 2 characters";
    } else if (/\d/.test(form.firstName)) {
      errors.firstName = "First name cannot contain numbers";
    }

    if (!form.lastName.trim() || form.lastName.length < 2) {
      errors.lastName = "Last name must be at least 2 characters";
    } else if (/\d/.test(form.lastName)) {
      errors.lastName = "Last name cannot contain numbers";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim() || !emailRegex.test(form.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Phone validation - exactly 10 digits
    const phoneDigits = form.phone.replace(/\D/g, "");
    if (phoneDigits.length !== 10) {
      errors.phone = "Phone number must be exactly 10 digits";
    }

    // Street address validation - min 5 chars
    if (!form.street.trim() || form.street.length < 5) {
      errors.street = "Street address must be at least 5 characters";
    }

    // PIN code validation - exactly 6 digits
    const pinDigits = form.postalCode.replace(/\D/g, "");
    if (pinDigits.length !== 6) {
      errors.postalCode = "PIN code must be exactly 6 digits";
    }

    setFormErrors(errors);
    return !Object.values(errors).some((error) => error !== "");
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix all errors before continuing");
      return;
    }
    setStep("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ============================================
  // RAZORPAY PAYMENT FLOW — UNCOMMENT WHEN READY
  // ============================================
  // To activate:
  // 1. Add RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET secrets
  // 2. Set RAZORPAY_ENABLED = true in src/lib/razorpay.ts
  // 3. Uncomment the imports at the top of this file
  // 4. Uncomment handleRazorpayPayment below
  // 5. Replace handlePaymentSubmit call with handleRazorpayPayment
  // ============================================

  // const handleRazorpayPayment = async () => {
  //   if (isSubmitting) return;
  //   setIsSubmitting(true);
  //
  //   const genOrderNumber = `SL-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  //
  //   try {
  //     // Step 1: Save order with payment_status "pending"
  //     const { data: order, error: orderError } = await supabase
  //       .from("orders")
  //       .insert({
  //         user_id: user!.id,
  //         order_number: genOrderNumber,
  //         subtotal: totalPrice,
  //         shipping,
  //         tax,
  //         discount,
  //         total,
  //         status: "pending",
  //         payment_status: "pending",
  //         shipping_address: {
  //           firstName: form.firstName, lastName: form.lastName,
  //           email: form.email, phone: form.phone,
  //           street: form.street, apartment: form.apartment,
  //           city: form.city, state: form.state,
  //           country: form.country, postalCode: form.postalCode,
  //         },
  //         payment_method: "razorpay",
  //       })
  //       .select()
  //       .single();
  //
  //     if (orderError) throw orderError;
  //
  //     // Save order items
  //     const orderItemsData = items.map((item) => ({
  //       order_id: order.id,
  //       skin_name: item.skin.name,
  //       skin_color: item.skin.color || null,
  //       skin_texture_image: item.skin.textureImage || null,
  //       device_name: item.device.name,
  //       coverage: item.coverage,
  //       quantity: item.quantity,
  //       price: item.price,
  //     }));
  //     await supabase.from("order_items").insert(orderItemsData);
  //
  //     // Record coupon usage if applied
  //     if (appliedCoupon && user) {
  //       await supabase.from("coupon_usages").insert({
  //         coupon_id: appliedCoupon.id,
  //         user_id: user.id,
  //         order_id: order.id,
  //       });
  //     }
  //
  //     // Step 2: Create Razorpay order
  //     const loaded = await loadRazorpayScript();
  //     if (!loaded) { toast.error("Failed to load payment gateway"); setIsSubmitting(false); return; }
  //
  //     const rzpOrder = await createRazorpayOrder(total, genOrderNumber, { order_id: order.id });
  //     if (!rzpOrder) { toast.error("Failed to initialize payment"); setIsSubmitting(false); return; }
  //
  //     // Step 3: Open Razorpay Checkout
  //     openRazorpayCheckout({
  //       key_id: rzpOrder.key_id,
  //       order_id: rzpOrder.order_id,
  //       amount: rzpOrder.amount,
  //       currency: rzpOrder.currency,
  //       name: "SkinLab",
  //       description: `Order ${genOrderNumber}`,
  //       prefill: {
  //         name: `${form.firstName} ${form.lastName}`,
  //         email: form.email,
  //         contact: form.phone,
  //       },
  //       onSuccess: async (response) => {
  //         // Step 4: Verify payment signature
  //         const verified = await verifyRazorpayPayment({
  //           razorpay_order_id: response.razorpay_order_id,
  //           razorpay_payment_id: response.razorpay_payment_id,
  //           razorpay_signature: response.razorpay_signature,
  //           order_id: order.id,
  //         });
  //
  //         if (verified) {
  //           setOrderNumber(genOrderNumber);
  //           setStep("confirmation");
  //           clearCart();
  //           window.scrollTo({ top: 0, behavior: "smooth" });
  //         } else {
  //           toast.error("Payment verification failed. Contact support.");
  //         }
  //         setIsSubmitting(false);
  //       },
  //       onDismiss: () => {
  //         toast.info("Payment cancelled");
  //         setIsSubmitting(false);
  //       },
  //     });
  //   } catch (err) {
  //     console.error("Razorpay payment error:", err);
  //     toast.error("Payment failed. Please try again.");
  //     setIsSubmitting(false);
  //   }
  // };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // ============================================
    // When Razorpay is enabled, replace this with:
    // handleRazorpayPayment();
    // return;
    // ============================================

    if (paymentMethod === "card" && (!cardForm.number || !cardForm.name || !cardForm.expiry || !cardForm.cvv)) {
      toast.error("Please fill in all card details");
      return;
    }
    setIsSubmitting(true);

    const genOrderNumber = `SL-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    try {
      if (appliedCoupon && user) {
        const { data: existingUsage } = await supabase
          .from("coupon_usages")
          .select("id")
          .eq("user_id", user.id)
          .eq("coupon_id", appliedCoupon.id)
          .maybeSingle();

        if (existingUsage) {
          toast.error("This coupon has already been used on your account.");
          setIsSubmitting(false);
          return;
        }
      }

      // Save order to database
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user!.id,
          order_number: genOrderNumber,
          subtotal: totalPrice,
          shipping,
          tax,
          discount,
          total,
          shipping_address: {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            phone: form.phone,
            street: form.street,
            apartment: form.apartment,
            city: form.city,
            state: form.state,
            country: form.country,
            postalCode: form.postalCode,
          },
          payment_method: paymentMethod,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Save order items
      const orderItemsData = items.map((item) => ({
        order_id: order.id,
        skin_name: item.skin.name,
        skin_color: item.skin.color || null,
        skin_texture_image: item.skin.textureImage || null,
        device_name: item.device.name,
        coverage: item.coverage,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItemsData);
      if (itemsError) throw itemsError;

      // Record coupon usage if applied
      if (appliedCoupon && user) {
        const { error: couponUsageError } = await supabase.from("coupon_usages").insert({
          coupon_id: appliedCoupon.id,
          user_id: user.id,
          order_id: order.id,
        });

        if (couponUsageError) throw couponUsageError;
      }

      // ============================================
      // EMAIL NOTIFICATION — Send order confirmation
      // ============================================
      try {
        await supabase.functions.invoke('send-email', {
          body: {
            type: 'order_placed',
            data: {
              customerEmail: form.email,
              customerName: `${form.firstName} ${form.lastName}`,
              orderNumber: genOrderNumber,
              items: orderItemsData.map((item) => ({
                skin_name: item.skin_name,
                device_name: item.device_name,
                coverage: item.coverage,
                quantity: item.quantity,
                price: item.price,
              })),
              subtotal: totalPrice,
              discount,
              tax,
              shipping,
              total,
              deliveryEstimate: '2-4 days',
              shippingAddress: `${form.street}, ${form.apartment ? form.apartment + ', ' : ''}${form.city}, ${form.state} - ${form.postalCode}`,
            },
          },
        });
        console.log('✅ Order confirmation email sent');
      } catch (emailErr) {
        console.error('❌ Email notification failed (non-blocking):', emailErr);
      }

      // ============================================
      // WHATSAPP NOTIFICATION — UNCOMMENT WHEN READY
      // ============================================
      // try {
      //   await supabase.functions.invoke('send-whatsapp', {
      //     body: {
      //       type: 'order_placed',
      //       data: {
      //         orderNumber: genOrderNumber,
      //         customerName: `${form.firstName} ${form.lastName}`,
      //         customerPhone: form.phone,
      //         total: total.toFixed(0),
      //         items: orderItemsData,
      //         deliveryEstimate: '2-4 days',
      //         shippingAddress: `${form.street}, ${form.city}, ${form.state} - ${form.postalCode}`,
      //       },
      //     },
      //   });
      // } catch (whatsappErr) {
      //   console.error('WhatsApp notification failed (non-blocking):', whatsappErr);
      // }

      setOrderNumber(genOrderNumber);
      setStep("confirmation");
      clearCart();
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(CHECKOUT_DRAFT_KEY);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Order save error:", err);
      toast.error("Failed to place order. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0 && step !== "confirmation") {
    navigate("/cart");
    return null;
  }

  if (step === "confirmation") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-lg text-center py-20">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.6 }}>
              <CheckCircle2 className="w-20 h-20 text-primary mx-auto mb-6" />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h1 className="text-3xl font-display font-bold mb-3">Order Confirmed!</h1>
              <p className="text-muted-foreground mb-2">Thank you for your purchase, {form.firstName}.</p>
              <p className="text-sm text-muted-foreground mb-8">
                A confirmation email has been sent to <span className="text-foreground">{form.email}</span>
              </p>
              <div className="rounded-xl border border-border/50 bg-card p-6 mb-8 text-left">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Order Number</span>
                  <span className="font-mono">{orderNumber}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Total Paid</span>
                  <span className="font-semibold">₹{total.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping to</span>
                  <span>{form.city}, {form.state}</span>
                </div>
              </div>
              <div className="flex gap-3 justify-center">
                <Link
                  to="/orders"
                  className="inline-flex items-center gap-2 bg-secondary text-foreground px-6 py-3 rounded-lg font-display font-semibold text-sm border border-border/50"
                >
                  View Orders
                </Link>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-display font-semibold text-sm"
                >
                  Continue Shopping
                </Link>
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/cart" className="hover:text-foreground transition-colors">Cart</Link>
            <ChevronRight size={14} />
            <span className={step === "address" ? "text-foreground" : "text-muted-foreground"}>Shipping</span>
            <ChevronRight size={14} />
            <span className={step === "payment" ? "text-foreground" : "text-muted-foreground"}>Payment</span>
          </div>

          {/* Steps indicator */}
          <div className="flex items-center gap-4 mb-10">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === "address" ? "bg-primary text-primary-foreground" : "bg-primary/20 text-primary"}`}>
                <Truck size={16} />
              </div>
              <span className={`text-sm font-medium ${step === "address" ? "text-foreground" : "text-muted-foreground"}`}>Shipping</span>
            </div>
            <div className="flex-1 h-px bg-border" />
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === "payment" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                <CreditCard size={16} />
              </div>
              <span className={`text-sm font-medium ${step === "payment" ? "text-foreground" : "text-muted-foreground"}`}>Payment</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
            {/* Form area */}
            <div>
              {step === "address" && (
                <motion.form
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onSubmit={handleAddressSubmit}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-display font-bold">Shipping Address</h2>
                  
                  {/* Service Area Notice */}
                  <div className="rounded-lg bg-muted/30 border border-border/50 p-3 flex items-start gap-2">
                    <Truck size={16} className="text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">Currently available only in Indore, Madhya Pradesh</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <InputField 
                      label="First Name *" 
                      value={form.firstName} 
                      onChange={(v) => setForm({ ...form, firstName: v })} 
                      placeholder="Rahul"
                      error={formErrors.firstName}
                    />
                    <InputField 
                      label="Last Name *" 
                      value={form.lastName} 
                      onChange={(v) => setForm({ ...form, lastName: v })} 
                      placeholder="Sharma"
                      error={formErrors.lastName}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField 
                      label="Email *" 
                      type="email" 
                      value={form.email} 
                      onChange={(v) => setForm({ ...form, email: v })} 
                      placeholder="rahul@example.com"
                      error={formErrors.email}
                    />
                    <InputField 
                      label="Phone *" 
                      type="tel" 
                      value={form.phone} 
                      onChange={(v) => {
                        const digits = v.replace(/\D/g, "");
                        if (digits.length <= 10) setForm({ ...form, phone: digits });
                      }}
                      placeholder="9876543210"
                      maxLength={10}
                      error={formErrors.phone}
                    />
                  </div>
                  <InputField 
                    label="Street Address / House No. *" 
                    value={form.street} 
                    onChange={(v) => setForm({ ...form, street: v })} 
                    placeholder="42, MG Road"
                    error={formErrors.street}
                  />
                  <InputField 
                    label="Landmark / Apartment" 
                    value={form.apartment} 
                    onChange={(v) => setForm({ ...form, apartment: v })} 
                    placeholder="Near City Mall, Flat 4B" 
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField 
                      label="City *" 
                      value={form.city} 
                      onChange={() => {}} 
                      placeholder="Indore"
                      disabled
                    />
                    <InputField 
                      label="State *" 
                      value={form.state} 
                      onChange={() => {}} 
                      placeholder="Madhya Pradesh"
                      disabled
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField 
                      label="Country *" 
                      value={form.country} 
                      onChange={() => {}} 
                      placeholder="India"
                      disabled
                    />
                    <InputField 
                      label="PIN Code *" 
                      value={form.postalCode} 
                      onChange={(v) => {
                        const digits = v.replace(/\D/g, "");
                        if (digits.length <= 6) setForm({ ...form, postalCode: digits });
                      }}
                      placeholder="452001"
                      maxLength={6}
                      error={formErrors.postalCode}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground py-3.5 rounded-lg font-display font-semibold text-sm hover:opacity-90 transition-opacity"
                  >
                    Continue to Payment
                  </button>
                </motion.form>
              )}

              {step === "payment" && (
                <motion.form
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onSubmit={handlePaymentSubmit}
                  className="space-y-6"
                >
                  <button type="button" onClick={() => setStep("address")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2">
                    <ArrowLeft size={16} /> Back to Shipping
                  </button>
                  <h2 className="text-2xl font-display font-bold">Payment Method</h2>
                  <div className="rounded-xl bg-card border border-border/50 p-4">
                    <p className="text-sm text-muted-foreground mb-1">Shipping to</p>
                    <p className="text-sm font-medium">{form.firstName} {form.lastName}</p>
                    <p className="text-sm text-muted-foreground">{form.street}{form.apartment ? `, ${form.apartment}` : ""}, {form.city}, {form.state} {form.postalCode}</p>
                  </div>
                  {/* ============================================
                     RAZORPAY MODE: When RAZORPAY_ENABLED = true,
                     payment method selection is hidden because
                     Razorpay handles UPI/Card/NetBanking in its modal.
                     ============================================ */}
                  {!RAZORPAY_ENABLED && (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <button type="button" onClick={() => setPaymentMethod("upi")} className={`p-4 rounded-xl border text-left transition-all ${paymentMethod === "upi" ? "border-primary/50 bg-primary/5" : "border-border/50 bg-card hover:bg-surface-hover"}`}>
                          <span className={`text-lg ${paymentMethod === "upi" ? "text-primary" : "text-muted-foreground"}`}>₹</span>
                          <p className="text-sm font-medium mt-2">UPI</p>
                          <p className="text-xs text-muted-foreground">GPay, PhonePe, Paytm</p>
                        </button>
                        <button type="button" onClick={() => setPaymentMethod("card")} className={`p-4 rounded-xl border text-left transition-all ${paymentMethod === "card" ? "border-primary/50 bg-primary/5" : "border-border/50 bg-card hover:bg-surface-hover"}`}>
                          <CreditCard size={20} className={paymentMethod === "card" ? "text-primary" : "text-muted-foreground"} />
                          <p className="text-sm font-medium mt-2">Card</p>
                          <p className="text-xs text-muted-foreground">Visa, RuPay, MC</p>
                        </button>
                      </div>
                      {paymentMethod === "card" && (
                        <div className="space-y-4">
                          <InputField label="Card Number" value={cardForm.number} onChange={(v) => setCardForm({ ...cardForm, number: v })} placeholder="4242 4242 4242 4242" maxLength={19} />
                          <InputField label="Name on Card" value={cardForm.name} onChange={(v) => setCardForm({ ...cardForm, name: v })} placeholder="Rahul Sharma" />
                          <div className="grid grid-cols-2 gap-4">
                            <InputField label="Expiry Date" value={cardForm.expiry} onChange={(v) => setCardForm({ ...cardForm, expiry: v })} placeholder="MM/YY" maxLength={5} />
                            <InputField label="CVV" value={cardForm.cvv} onChange={(v) => setCardForm({ ...cardForm, cvv: v })} placeholder="123" maxLength={4} type="password" />
                          </div>
                        </div>
                      )}
                      {paymentMethod === "upi" && (
                        <div className="rounded-xl bg-card border border-border/50 p-6 text-center">
                          <p className="text-sm text-muted-foreground mb-2">You'll be redirected to complete payment</p>
                          <p className="text-2xl font-display font-bold">₹{total.toFixed(0)}</p>
                        </div>
                      )}
                    </>
                  )}

                  {/* Razorpay info when enabled */}
                  {RAZORPAY_ENABLED && (
                    <div className="rounded-xl bg-card border border-primary/20 p-6 text-center">
                      <CreditCard size={24} className="text-primary mx-auto mb-2" />
                      <p className="text-sm font-medium mb-1">Pay via Razorpay</p>
                      <p className="text-xs text-muted-foreground mb-3">UPI, Cards, Net Banking, Wallets</p>
                      <p className="text-2xl font-display font-bold">₹{total.toFixed(0)}</p>
                    </div>
                  )}

                  {/* Pay button — shows "Coming Soon" when Razorpay not yet active */}
                  {RAZORPAY_ENABLED ? (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary text-primary-foreground py-3.5 rounded-lg font-display font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
                      {isSubmitting ? "Processing..." : `Pay ₹${total.toFixed(0)}`}
                    </button>
                  ) : (
                    <>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary text-primary-foreground py-3.5 rounded-lg font-display font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
                        {isSubmitting ? "Processing..." : `Place Order — ₹${total.toFixed(0)}`}
                      </button>
                      <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-muted/50 border border-border/50">
                        <Clock size={14} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Online Payment (Razorpay) Coming Soon</span>
                      </div>
                    </>
                  )}
                  <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                    <Lock size={12} /> Secured with 256-bit SSL encryption
                  </p>
                </motion.form>
              )}
            </div>

            {/* Order summary sidebar */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-xl border border-border/50 bg-card p-6">
                <h3 className="font-display font-semibold text-lg mb-4">Order Summary</h3>
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-12 h-12 rounded-lg flex-shrink-0 bg-cover bg-center" style={item.skin.textureImage ? { backgroundImage: `url(${item.skin.textureImage})` } : { backgroundColor: item.skin.color }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.skin.name}</p>
                        <p className="text-xs text-muted-foreground">{item.device.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">₹{(item.price * item.quantity).toFixed(0)}</p>
                        <p className="text-xs text-muted-foreground">×{item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Coupon Code Section */}
                <div className="border-t border-border/50 pt-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag size={14} className="text-muted-foreground" />
                    <span className="text-sm font-medium">Coupon Code</span>
                  </div>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-primary/10 border border-primary/20 rounded-lg px-3 py-2">
                      <div>
                        <span className="text-sm font-semibold text-primary">{appliedCoupon.code}</span>
                        <span className="text-xs text-muted-foreground ml-2">({appliedCoupon.discount_percent}% off)</span>
                      </div>
                      <button onClick={handleRemoveCoupon} className="text-muted-foreground hover:text-foreground transition-colors">
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(""); }}
                          placeholder="Enter code"
                          maxLength={20}
                          className="flex-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors placeholder:text-muted-foreground/50"
                        />
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          disabled={couponLoading || !couponCode.trim()}
                          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-1"
                        >
                          {couponLoading ? <Loader2 size={14} className="animate-spin" /> : "Apply"}
                        </button>
                      </div>
                      {couponError && <p className="text-xs text-destructive mt-1.5">{couponError}</p>}
                    </div>
                  )}
                </div>

                <div className="border-t border-border/50 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{totalPrice.toFixed(0)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-primary">
                      <span>Discount ({appliedCoupon?.discount_percent}%)</span>
                      <span>-₹{discount.toFixed(0)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">GST (18%)</span>
                    <span>₹{tax.toFixed(0)}</span>
                  </div>
                  <div className="border-t border-border/50 pt-3 flex justify-between font-display font-bold text-lg">
                    <span>Total</span>
                    <span>₹{total.toFixed(0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const InputField = ({
  label, value, onChange, placeholder, type = "text", maxLength, error, disabled = false,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string; maxLength?: number; error?: string; disabled?: boolean;
}) => (
  <div>
    <label className="text-sm font-medium mb-1.5 block text-muted-foreground">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      disabled={disabled}
      className={`w-full bg-secondary border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors placeholder:text-muted-foreground/50 disabled:opacity-60 disabled:cursor-not-allowed ${
        error ? "border-destructive focus:ring-destructive focus:border-destructive" : "border-border"
      }`}
    />
    {error && <p className="text-xs text-destructive mt-1.5">{error}</p>}
  </div>
);

export default CheckoutPage;
