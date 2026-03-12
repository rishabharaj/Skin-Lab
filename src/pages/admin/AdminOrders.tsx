import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { Search, ChevronDown, Truck, Package, MapPin, Phone, Mail } from "lucide-react";

const statuses = ["confirmed", "processing", "shipped", "delivered", "cancelled"];

const deliveryOptions = [
  "Delivering today",
  "Tomorrow",
  "2-4 days",
  "3 days",
  "5 days",
  "1 week",
];

const statusColors: Record<string, string> = {
  confirmed: "bg-blue-500/10 text-blue-400",
  processing: "bg-yellow-500/10 text-yellow-400",
  shipped: "bg-orange-500/10 text-orange-400",
  delivered: "bg-green-500/10 text-green-400",
  cancelled: "bg-red-500/10 text-red-400",
};

const AdminOrders = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [customEstimate, setCustomEstimate] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();

  // Fetch all orders with profiles
  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Fetch all profiles for customer info
  const { data: profiles } = useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) throw error;
      return data;
    },
  });

  // Fetch all order items
  const { data: allItems } = useQuery({
    queryKey: ["admin-order-items"],
    queryFn: async () => {
      const { data, error } = await supabase.from("order_items").select("*");
      if (error) throw error;
      return data;
    },
  });

  // Update order mutation
  const updateOrder = useMutation({
    mutationFn: async ({ id, status, delivery_estimate }: { id: string; status?: string; delivery_estimate?: string }) => {
      const updates: Record<string, any> = { status_updated_at: new Date().toISOString() };
      if (status) updates.status = status;
      if (delivery_estimate) updates.delivery_estimate = delivery_estimate;
      console.log("[OrderUpdate] Updating order:", id, "with:", updates);

      const { data, error } = await supabase.from("orders").update(updates).eq("id", id).select();
      console.log("[OrderUpdate] Result:", data, "Error:", error);
      if (error) throw error;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast({ title: "Order updated successfully" });

      // ============================================
      // WHATSAPP STATUS UPDATE — UNCOMMENT WHEN READY
      // Requires WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID secrets
      // ============================================
      // if (variables.status) {
      //   const order = orders?.find((o) => o.id === variables.id);
      //   const profile = order ? profileMap.get(order.user_id) : null;
      //   const address = order?.shipping_address as Record<string, string> | null;
      //   const phone = profile?.phone || address?.phone;
      //   if (phone) {
      //     supabase.functions.invoke('send-whatsapp', {
      //       body: {
      //         type: 'status_update',
      //         data: {
      //           orderNumber: order?.order_number,
      //           customerName: profile?.full_name || 'Customer',
      //           customerPhone: phone,
      //           newStatus: variables.status,
      //           deliveryEstimate: variables.delivery_estimate || (order as any)?.delivery_estimate,
      //         },
      //       },
      //     }).catch((err) => console.error('WhatsApp notification failed:', err));
      //   }
      // }
    },
    onError: (err: any) => {
      console.error("Order update error:", err);
      toast({ title: "Update failed", description: err.message, variant: "destructive" });
    },
  });

  const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);

  const filtered = (orders || []).filter((o) => {
    if (statusFilter && o.status !== statusFilter) return false;
    if (!search) return true;
    const profile = profileMap.get(o.user_id);
    const q = search.toLowerCase();
    return (
      o.order_number.toLowerCase().includes(q) ||
      (profile?.full_name || "").toLowerCase().includes(q) ||
      (profile?.email || "").toLowerCase().includes(q) ||
      (profile?.phone || "").toLowerCase().includes(q)
    );
  });

  const getStatusCount = (s: string) => (orders || []).filter((o) => o.status === s).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Orders</h1>
        <p className="text-sm text-muted-foreground">Manage and track customer orders</p>
      </div>

      {/* Status filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setStatusFilter(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            !statusFilter ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
          }`}
        >
          All ({orders?.length || 0})
        </button>
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors capitalize ${
              statusFilter === s ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}
          >
            {s} ({getStatusCount(s)})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by name, email, phone, or order number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-secondary border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Orders list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order, i) => {
            const profile = profileMap.get(order.user_id);
            const items = allItems?.filter((it) => it.order_id === order.id) || [];
            const address = order.shipping_address as Record<string, string> | null;

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="rounded-xl border border-border/50 bg-card overflow-hidden"
              >
                {/* Collapsed row */}
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-accent/30 transition-colors"
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div>
                      <p className="text-sm font-medium">{profile?.full_name || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground">{order.order_number}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-semibold">₹{Number(order.total).toFixed(0)}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[order.status] || ""}`}>
                      {order.status}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-muted-foreground transition-transform ${expandedOrder === order.id ? "rotate-180" : ""}`}
                    />
                  </div>
                </div>

                {/* Expanded */}
                {expandedOrder === order.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="border-t border-border/30 bg-secondary/20"
                  >
                    {/* Customer Info */}
                    <div className="p-4 border-b border-border/20">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-3">Customer Details</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-muted-foreground" />
                          <span>{profile?.email || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={14} className="text-muted-foreground" />
                          <span>{profile?.phone || address?.phone || "N/A"}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin size={14} className="text-muted-foreground mt-0.5" />
                          <span>
                            {address
                              ? `${address.fullName}, ${address.address}, ${address.city}, ${address.state} - ${address.pinCode}`
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Order Items with images */}
                    <div className="p-4 border-b border-border/20">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-3">Items</p>
                      <div className="space-y-2">
                        {items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 text-sm">
                            <div
                              className="w-10 h-10 rounded-lg flex-shrink-0 bg-cover bg-center border border-border/30"
                              style={
                                item.skin_texture_image
                                  ? { backgroundImage: `url(${item.skin_texture_image})` }
                                  : { backgroundColor: item.skin_color || "#333" }
                              }
                            />
                            <div className="flex-1 min-w-0">
                              <span className="font-medium">{item.skin_name}</span>
                              <span className="text-muted-foreground"> for {item.device_name}</span>
                              <span className="text-xs text-muted-foreground ml-2">({item.coverage})</span>
                            </div>
                            <div className="text-right">
                              <span className="font-medium">₹{(Number(item.price) * item.quantity).toFixed(0)}</span>
                              <span className="text-muted-foreground text-xs ml-1">×{item.quantity}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-end mt-3 pt-2 border-t border-border/20">
                        <span className="font-display font-bold">Total: ₹{Number(order.total).toFixed(0)}</span>
                      </div>
                    </div>

                    {/* Status Update */}
                    <div className="p-4 space-y-4">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">Update Status</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          {statuses.map((s) => (
                            <button
                              key={s}
                              disabled={updateOrder.isPending}
                              onClick={(e) => {
                                e.stopPropagation();
                                updateOrder.mutate({ id: order.id, status: s });
                              }}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
                                order.status === s
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-accent"
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">Delivery Estimate</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          {deliveryOptions.map((opt) => (
                            <button
                              key={opt}
                              disabled={updateOrder.isPending}
                              onClick={(e) => {
                                e.stopPropagation();
                                updateOrder.mutate({ id: order.id, delivery_estimate: opt });
                              }}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                                (order as any).delivery_estimate === opt
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-accent"
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                        {/* Custom input */}
                        <div className="flex items-center gap-2 mt-2">
                          <input
                            type="text"
                            placeholder="Custom estimate (e.g. 10 days)"
                            value={customEstimate[order.id] || ""}
                            onChange={(e) => setCustomEstimate((prev) => ({ ...prev, [order.id]: e.target.value }))}
                            className="flex-1 bg-secondary border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                          <button
                            disabled={!customEstimate[order.id] || updateOrder.isPending}
                            onClick={() => {
                              updateOrder.mutate({ id: order.id, delivery_estimate: customEstimate[order.id] });
                              setCustomEstimate((prev) => ({ ...prev, [order.id]: "" }));
                            }}
                            className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
                          >
                            Set
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      <p className="text-sm text-muted-foreground">Showing {filtered.length} orders</p>
    </div>
  );
};

export default AdminOrders;
