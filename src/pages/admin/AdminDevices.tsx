import { useState } from "react";
import { motion } from "framer-motion";
import { useAllDeviceModels, useDeviceBrands } from "@/hooks/useDevices";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeviceFormData {
  name: string;
  slug: string;
  brand_id: string;
}

const AdminDevices = () => {
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingDevice, setEditingDevice] = useState<any | null>(null);
  const [formData, setFormData] = useState<DeviceFormData>({
    name: "",
    slug: "",
    brand_id: "",
  });
  const queryClient = useQueryClient();

  const { data: brands = [] } = useDeviceBrands();
  const { data: allModels = [], isLoading } = useAllDeviceModels();

  const models = allModels.filter(
    (m) =>
      (!selectedBrand || m.device_brands?.slug === selectedBrand) &&
      (!search || m.name.toLowerCase().includes(search.toLowerCase()))
  );

  // Add device mutation
  const addDevice = useMutation({
    mutationFn: async (data: DeviceFormData) => {
      console.log("[AddDevice] Submitting:", data);
      const { error } = await supabase.from("device_models").insert({
        name: data.name,
        slug: data.slug,
        brand_id: data.brand_id,
      });
      if (error) {
        console.error("[AddDevice] Error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-device-models"] });
      toast.success("Device added successfully");
      setShowAddDialog(false);
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to add device");
    },
  });

  // Update device mutation
  const updateDevice = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<DeviceFormData> }) => {
      const { error } = await supabase.from("device_models").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-device-models"] });
      toast.success("Device updated");
      setEditingDevice(null);
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update device");
    },
  });

  // Delete device mutation
  const deleteDevice = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("device_models").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-device-models"] });
      toast.success("Device deleted");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete device");
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      brand_id: brands[0]?.id || "",
    });
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  };

  const openEditDialog = (device: any) => {
    setEditingDevice(device);
    setFormData({
      name: device.name,
      slug: device.slug,
      brand_id: device.brand_id,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug || !formData.brand_id) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (editingDevice) {
      updateDevice.mutate({ id: editingDevice.id, data: formData });
    } else {
      addDevice.mutate(formData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Devices</h1>
          <p className="text-sm text-muted-foreground">Manage phone brands and models ({allModels.length} total)</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddDialog(true);
          }}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> Add Device
        </button>
      </div>

      {/* Brand filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedBrand(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            !selectedBrand ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
          }`}
        >
          All Brands
        </button>
        {brands.map((brand) => (
          <button
            key={brand.id}
            onClick={() => setSelectedBrand(brand.slug)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedBrand === brand.slug ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}
          >
            {brand.name}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search devices..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-secondary border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Devices table */}
      <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 uppercase tracking-wider">Model</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 uppercase tracking-wider">Brand</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3 uppercase tracking-wider">Mask</th>
                <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/30">
                    <td className="px-4 py-3"><div className="h-5 bg-secondary rounded w-32 animate-pulse" /></td>
                    <td className="px-4 py-3"><div className="h-5 bg-secondary rounded w-20 animate-pulse" /></td>
                    <td className="px-4 py-3"><div className="h-5 bg-secondary rounded w-12 animate-pulse" /></td>
                    <td className="px-4 py-3"><div className="h-5 bg-secondary rounded w-16 ml-auto animate-pulse" /></td>
                  </tr>
                ))
              ) : (
                models.map((model, i) => (
                  <motion.tr
                    key={model.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-border/30 last:border-0 hover:bg-accent/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center text-sm">📱</div>
                        <span className="text-sm font-medium">{model.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{model.device_brands?.name}</td>
                    <td className="px-4 py-3">
                      {model.mockup_url ? (
                        <span className="text-green-400 text-xs">✓ Uploaded</span>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditDialog(model)}
                          className="p-1.5 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete ${model.name}?`)) {
                              deleteDevice.mutate(model.id);
                            }
                          }}
                          className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-border/50 text-sm text-muted-foreground">
          Showing {models.length} of {allModels.length} devices
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog || !!editingDevice} onOpenChange={(open) => {
        if (!open) {
          setShowAddDialog(false);
          setEditingDevice(null);
          resetForm();
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingDevice ? "Edit Device" : "Add New Device"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Device Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    name,
                    slug: editingDevice ? prev.slug : generateSlug(name),
                  }));
                }}
                placeholder="iPhone 15 Pro Max"
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="iphone-15-pro-max"
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary font-mono"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Brand</label>
              <select
                value={formData.brand_id}
                onChange={(e) => setFormData((prev) => ({ ...prev, brand_id: e.target.value }))}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Select brand...</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowAddDialog(false);
                  setEditingDevice(null);
                  resetForm();
                }}
                className="flex-1 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={addDevice.isPending || updateDevice.isPending}
                className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {(addDevice.isPending || updateDevice.isPending) && <Loader2 size={14} className="animate-spin" />}
                {editingDevice ? "Update" : "Add"} Device
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDevices;

