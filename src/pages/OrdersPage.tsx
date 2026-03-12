import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Package, MapPin, CreditCard, Truck, CheckCircle2, Clock, Box } from "lucide-react";

const statusSteps = ["confirmed", "processing", "shipped", "delivered"];

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  confirmed: { label: "Confirmed", color: "text-blue-400", icon: CheckCircle2 },
  processing: { label: "Processing", color: "text-yellow-400", icon: Clock },
  shipped: { label: "Shipped", color: "text-orange-400", icon: Truck },
  delivered: { label: "Delivered", color: "text-green-400", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "text-red-400", icon: Package },
};

const OrdersPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login?redirect=/orders", { replace: true });
    }
  }, [user, loading, navigate]);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: orderItems } = useQuery({
    queryKey: ["order_items", user?.id],
    queryFn: async () => {
      if (!orders?.length) return [];
      const { data, error } = await supabase
        .from("order_items")
        .select("*")
        .in("order_id", orders.map((o) => o.id));
      if (error) throw error;
      return data;
    },
    enabled: !!orders?.length,
  });

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16 flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl font-display font-bold mb-8">My Orders</h1>

          {!orders?.length ? (
            <div className="text-center py-20">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No orders yet</p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-display font-semibold text-sm"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const items = orderItems?.filter((i) => i.order_id === order.id) || [];
                const currentStepIndex = statusSteps.indexOf(order.status);
                const address = order.shipping_address as Record<string, string> | null;
                const cfg = statusConfig[order.status] || statusConfig.confirmed;

                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-border/50 bg-card overflow-hidden"
                  >
                    {/* Header */}
                    <div className="p-5 border-b border-border/30">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-mono text-sm font-semibold">{order.order_number}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString("en-IN", {
                              day: "numeric", month: "short", year: "numeric",
                            })}
                          </p>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 ${cfg.color}`}>
                          <cfg.icon size={12} />
                          {cfg.label}
                        </span>
                      </div>

                      {/* Delivery Estimate */}
                      <div className="flex items-center gap-2 bg-secondary/50 rounded-lg px-3 py-2">
                        <Truck size={14} className="text-primary" />
                        <span className="text-sm font-medium">
                          {order.status === "delivered"
                            ? "Delivered"
                            : order.status === "cancelled"
                            ? "Order cancelled"
                            : `Arriving in ${(order as any).delivery_estimate || "2-4 days"}`}
                        </span>
                      </div>

                      {/* Status Timeline */}
                      {order.status !== "cancelled" && (
                        <div className="flex items-center gap-1 mt-4">
                          {statusSteps.map((step, i) => {
                            const done = i <= currentStepIndex;
                            return (
                              <div key={step} className="flex-1 flex flex-col items-center">
                                <div className={`w-full h-1.5 rounded-full ${done ? "bg-primary" : "bg-secondary"}`} />
                                <span className={`text-[10px] mt-1 capitalize ${done ? "text-primary font-medium" : "text-muted-foreground"}`}>
                                  {step}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Items */}
                    {items.length > 0 && (
                      <div className="p-5 border-b border-border/30 space-y-3">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">Items</p>
                        {items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3">
                            <div
                              className="w-12 h-12 rounded-lg flex-shrink-0 bg-cover bg-center border border-border/30"
                              style={
                                item.skin_texture_image
                                  ? { backgroundImage: `url(${item.skin_texture_image})` }
                                  : { backgroundColor: item.skin_color || "#333" }
                              }
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{item.skin_name}</p>
                              <p className="text-xs text-muted-foreground">
                                {item.device_name} · ×{item.quantity}
                              </p>
                            </div>
                            <p className="text-sm font-semibold">₹{(Number(item.price) * item.quantity).toFixed(0)}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Price Breakdown + Address */}
                    <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Price Breakdown */}
                      <div className="space-y-1.5 text-sm">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">Price Breakdown</p>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span>₹{Number(order.subtotal).toFixed(0)}</span>
                        </div>
                        {Number(order.discount) > 0 && (
                          <div className="flex justify-between text-green-400">
                            <span>Discount</span>
                            <span>-₹{Number(order.discount).toFixed(0)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">GST (18%)</span>
                          <span>₹{Number(order.tax).toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Shipping</span>
                          <span>{Number(order.shipping) === 0 ? "Free" : `₹${Number(order.shipping).toFixed(0)}`}</span>
                        </div>
                        <div className="flex justify-between font-bold pt-1.5 border-t border-border/30">
                          <span>Total</span>
                          <span>₹{Number(order.total).toFixed(0)}</span>
                        </div>
                      </div>

                      {/* Shipping Address */}
                      <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">Shipping Address</p>
                        {address ? (
                          <div className="text-sm space-y-0.5">
                            <p className="font-medium">{address.fullName}</p>
                            <p className="text-muted-foreground">{address.address}</p>
                            <p className="text-muted-foreground">
                              {address.city}, {address.state} - {address.pinCode}
                            </p>
                            {address.phone && (
                              <p className="text-muted-foreground">📞 {address.phone}</p>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">Not available</p>
                        )}
                        {order.payment_method && (
                          <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                            <CreditCard size={12} />
                            <span className="capitalize">{order.payment_method}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrdersPage;
