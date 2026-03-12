import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Search, Check, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CouponFormData {
  code: string;
  discount_percent: number;
  max_uses: number;
  is_active: boolean;
}

const AdminCoupons = () => {
  const [search, setSearch] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any | null>(null);
  const [formData, setFormData] = useState<CouponFormData>({
    code: "",
    discount_percent: 10,
    max_uses: 100,
    is_active: true,
  });
  const queryClient = useQueryClient();

  // Fetch coupons
  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ["admin-coupons"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Add coupon mutation
  const addCoupon = useMutation({
    mutationFn: async (data: CouponFormData) => {
      const { error } = await supabase.from("coupons").insert({
        code: data.code.toUpperCase(),
        discount_percent: data.discount_percent,
        max_uses: data.max_uses,
        is_active: data.is_active,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      toast.success("Coupon added successfully");
      setShowAddDialog(false);
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to add coupon");
    },
  });

  // Update coupon mutation
  const updateCoupon = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CouponFormData> }) => {
      const { error } = await supabase.from("coupons").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      toast.success("Coupon updated");
      setEditingCoupon(null);
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update coupon");
    },
  });

  // Delete coupon mutation
  const deleteCoupon = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("coupons").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      toast.success("Coupon deleted");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete coupon");
    },
  });

  const resetForm = () => {
    setFormData({ code: "", discount_percent: 10, max_uses: 100, is_active: true });
  };

  const openEditDialog = (coupon: any) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discount_percent: coupon.discount_percent,
      max_uses: coupon.max_uses,
      is_active: coupon.is_active,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCoupon) {
      updateCoupon.mutate({ id: editingCoupon.id, data: formData });
    } else {
      addCoupon.mutate(formData);
    }
  };

  const filtered = coupons.filter((c) =>
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Coupons</h1>
          <p className="text-sm text-muted-foreground">
            Manage discount coupons. A user can redeem many different coupons, but the same coupon only once.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddDialog(true);
          }}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> Add Coupon
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search coupons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-secondary border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Info banner */}
      <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
        <h3 className="text-sm font-semibold mb-1">Coupon Rules</h3>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Each coupon can only be used ONCE per user account</li>
          <li>• A user can redeem multiple different unique coupons</li>
          <li>• Overall coupon availability still respects max usage limits</li>
        </ul>
      </div>

      {/* Coupons table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 uppercase tracking-wider">Code</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 uppercase tracking-wider">Discount</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 uppercase tracking-wider">Usage</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 uppercase tracking-wider">Status</th>
                  <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((coupon, i) => (
                  <motion.tr
                    key={coupon.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-border/30 last:border-0 hover:bg-accent/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-primary">{coupon.code}</span>
                    </td>
                    <td className="px-4 py-3 text-sm">{coupon.discount_percent}%</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {coupon.times_used} / {coupon.max_uses}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          coupon.is_active
                            ? "bg-green-500/10 text-green-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {coupon.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditDialog(coupon)}
                          className="p-1.5 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Delete this coupon?")) {
                              deleteCoupon.mutate(coupon.id);
                            }
                          }}
                          className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                      No coupons found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-border/50 text-sm text-muted-foreground">
            Showing {filtered.length} coupons
          </div>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog || !!editingCoupon} onOpenChange={(open) => {
        if (!open) {
          setShowAddDialog(false);
          setEditingCoupon(null);
          resetForm();
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCoupon ? "Edit Coupon" : "Add New Coupon"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Coupon Code</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
                placeholder="SAVE20"
                required
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Discount %</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.discount_percent}
                  onChange={(e) => setFormData((prev) => ({ ...prev, discount_percent: parseInt(e.target.value) || 0 }))}
                  required
                  className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Max Uses</label>
                <input
                  type="number"
                  min="1"
                  value={formData.max_uses}
                  onChange={(e) => setFormData((prev) => ({ ...prev, max_uses: parseInt(e.target.value) || 1 }))}
                  required
                  className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData((prev) => ({ ...prev, is_active: e.target.checked }))}
                className="w-4 h-4 rounded border-border"
              />
              <label htmlFor="is_active" className="text-sm">Active</label>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowAddDialog(false);
                  setEditingCoupon(null);
                  resetForm();
                }}
                className="flex-1 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={addCoupon.isPending || updateCoupon.isPending}
                className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {(addCoupon.isPending || updateCoupon.isPending) && <Loader2 size={14} className="animate-spin" />}
                {editingCoupon ? "Update" : "Add"} Coupon
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCoupons;
