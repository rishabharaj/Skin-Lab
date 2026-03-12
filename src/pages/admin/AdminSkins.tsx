import { useState } from "react";
import { motion } from "framer-motion";
import { useAllSkins, useSkinCollections } from "@/hooks/useSkins";
import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Search, Loader2, Upload, FolderPlus } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SkinFormData {
  name: string;
  collection: string;
  price: number;
  originalPrice: number | undefined;
  color: string;
  badge: "" | "trending" | "bestseller" | "new";
  offer: string;
}

interface CollectionFormData {
  id: string;
  name: string;
  description: string;
}

const AdminSkins = () => {
  const [search, setSearch] = useState("");
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showCollectionDialog, setShowCollectionDialog] = useState(false);
  const [editingSkin, setEditingSkin] = useState<any | null>(null);
  const [textureFile, setTextureFile] = useState<File | null>(null);
  const [texturePreview, setTexturePreview] = useState<string>("");
  const [collectionForm, setCollectionForm] = useState<CollectionFormData>({ id: "", name: "", description: "" });
  const [formData, setFormData] = useState<SkinFormData>({
    name: "",
    collection: "",
    price: 499,
    originalPrice: undefined,
    color: "#1a1a1a",
    badge: "",
    offer: "",
  });

  const queryClient = useQueryClient();
  const { data: skins = [], isLoading } = useAllSkins();
  const { data: skinCollections = [] } = useSkinCollections();

  const filtered = skins.filter(
    (s) =>
      (!selectedCollection || s.collection === selectedCollection) &&
      (!search || s.name.toLowerCase().includes(search.toLowerCase()))
  );

  const resetForm = () => {
    setFormData({
      name: "",
      collection: skinCollections[0]?.id || "",
      price: 499,
      originalPrice: undefined,
      color: "#1a1a1a",
      badge: "",
      offer: "",
    });
    setTextureFile(null);
    setTexturePreview("");
  };

  const resetCollectionForm = () => setCollectionForm({ id: "", name: "", description: "" });

  const uploadTexture = async (file: File, skinName: string) => {
    const ext = file.name.split(".").pop() || "png";
    const safe = skinName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const path = `skins/${Date.now()}-${safe}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("skin-images")
      .upload(path, file, { upsert: true, contentType: file.type || "image/png" });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("skin-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const saveSkin = useMutation({
    mutationFn: async () => {
      const textureUrl = textureFile
        ? await uploadTexture(textureFile, formData.name)
        : editingSkin?.textureImage || null;

      const payload = {
        name: formData.name,
        category: formData.collection,
        price: formData.price,
        original_price: formData.originalPrice ?? null,
        color: formData.color,
        texture_image: textureUrl,
        badge: formData.badge || null,
        offer_tag: formData.offer || null,
        is_new: formData.badge === "new",
        is_trending: formData.badge === "trending" || formData.badge === "bestseller",
      };

      if (editingSkin?.id) {
        const { error } = await supabase.from("skins").update(payload).eq("id", editingSkin.id);
        if (error) throw error;
        return;
      }

      const { error } = await supabase.from("skins").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skins"] });
      toast.success(editingSkin ? "Skin updated" : "Skin added");
      setShowAddDialog(false);
      setEditingSkin(null);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to save skin");
    },
  });

  const deleteSkin = useMutation({
    mutationFn: async (skinId: string) => {
      const { error } = await supabase.from("skins").delete().eq("id", skinId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skins"] });
      toast.success("Skin deleted");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete skin");
    },
  });

  const addCollection = useMutation({
    mutationFn: async (data: CollectionFormData) => {
      const id = data.id.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const { error } = await supabase.from("skin_collections").insert({
        id,
        name: data.name.trim(),
        description: data.description.trim() || null,
        sort_order: skinCollections.length + 1,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skin-collections"] });
      toast.success("Collection added");
      resetCollectionForm();
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to add collection");
    },
  });

  const deleteCollection = useMutation({
    mutationFn: async (collectionId: string) => {
      const usedBySkins = skins.some((skin) => skin.collection === collectionId);
      if (usedBySkins) {
        throw new Error("This collection is already used by skins. Move/delete those skins first.");
      }
      const { error } = await supabase.from("skin_collections").delete().eq("id", collectionId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skin-collections"] });
      toast.success("Collection deleted");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete collection");
    },
  });

  const openEditDialog = (skin: any) => {
    setEditingSkin(skin);
    setFormData({
      name: skin.name,
      collection: skin.collection,
      price: skin.price,
      originalPrice: skin.originalPrice,
      color: skin.color,
      badge: skin.badge || "",
      offer: skin.offer || "",
    });
    setTexturePreview(skin.textureImage || "");
    setTextureFile(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSkin.mutate();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Skins</h1>
          <p className="text-sm text-muted-foreground">Manage skin designs from database ({skins.length} total)</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCollectionDialog(true)}
            className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-accent transition-colors"
          >
            <FolderPlus size={16} /> Manage Collections
          </button>
          <button
            onClick={() => {
              resetForm();
              setShowAddDialog(true);
            }}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus size={16} /> Add Skin
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCollection(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            !selectedCollection ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
          }`}
        >
          All Collections
        </button>
        {skinCollections.map((col) => (
          <button
            key={col.id}
            onClick={() => setSelectedCollection(col.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCollection === col.id ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}
          >
            {col.name}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search skins..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-secondary border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Loading skins...</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((skin, i) => (
            <motion.div
              key={skin.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02 }}
              className="rounded-xl border border-border/50 bg-card overflow-hidden group"
            >
              <div className="aspect-square relative bg-cover bg-center" style={skin.textureImage ? { backgroundImage: `url(${skin.textureImage})` } : { backgroundColor: skin.color }}>
                {skin.badge && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-primary text-primary-foreground">
                    {skin.badge}
                  </span>
                )}
                <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => openEditDialog(skin)}
                    className="p-2 rounded-lg bg-card/90 hover:bg-card transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Delete this skin?")) deleteSkin.mutate(skin.id);
                    }}
                    className="p-2 rounded-lg bg-card/90 hover:bg-destructive/20 transition-colors text-destructive"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-medium truncate">{skin.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-muted-foreground capitalize">{skin.collection}</span>
                  <div className="flex items-center gap-1.5">
                    {skin.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">Rs{skin.originalPrice}</span>
                    )}
                    <span className="text-sm font-semibold">Rs{skin.price}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <p className="text-sm text-muted-foreground">Showing {filtered.length} skins</p>

      <Dialog open={showCollectionDialog} onOpenChange={(open) => {
        setShowCollectionDialog(open);
        if (!open) resetCollectionForm();
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Collections</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addCollection.mutate(collectionForm);
              }}
              className="space-y-3"
            >
              <input
                type="text"
                value={collectionForm.name}
                onChange={(e) => setCollectionForm((prev) => ({
                  ...prev,
                  name: e.target.value,
                  id: prev.id || e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                }))}
                placeholder="Collection name"
                required
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <input
                type="text"
                value={collectionForm.id}
                onChange={(e) => setCollectionForm((prev) => ({ ...prev, id: e.target.value }))}
                placeholder="collection-id"
                required
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <textarea
                value={collectionForm.description}
                onChange={(e) => setCollectionForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Short description"
                rows={3}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="submit"
                disabled={addCollection.isPending}
                className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Add Collection
              </button>
            </form>

            <div className="space-y-2 max-h-64 overflow-auto">
              {skinCollections.map((collection) => (
                <div key={collection.id} className="flex items-start justify-between gap-3 rounded-lg border border-border/50 p-3">
                  <div>
                    <p className="text-sm font-medium">{collection.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{collection.id}</p>
                    {collection.description && <p className="text-xs text-muted-foreground mt-1">{collection.description}</p>}
                  </div>
                  <button
                    onClick={() => {
                      if (confirm(`Delete collection ${collection.name}?`)) {
                        deleteCollection.mutate(collection.id);
                      }
                    }}
                    className="p-2 rounded-md hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddDialog || !!editingSkin} onOpenChange={(open) => {
        if (!open) {
          setShowAddDialog(false);
          setEditingSkin(null);
          resetForm();
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSkin ? "Edit Skin" : "Add New Skin"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Carbon Black"
                required
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Collection</label>
              <select
                value={formData.collection}
                onChange={(e) => setFormData((prev) => ({ ...prev, collection: e.target.value }))}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Select collection</option>
                {skinCollections.map((col) => (
                  <option key={col.id} value={col.id}>{col.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Price (Rs)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData((prev) => ({ ...prev, price: parseInt(e.target.value, 10) || 0 }))}
                  required
                  className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">MRP (Rs)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.originalPrice || ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, originalPrice: parseInt(e.target.value, 10) || undefined }))}
                  placeholder="Optional"
                  className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
                    className="w-10 h-10 rounded-lg border border-border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
                    className="flex-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Badge</label>
                <select
                  value={formData.badge}
                  onChange={(e) => setFormData((prev) => ({ ...prev, badge: e.target.value as SkinFormData["badge"] }))}
                  className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">None</option>
                  <option value="trending">Trending</option>
                  <option value="bestseller">Bestseller</option>
                  <option value="new">New</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Offer Tag</label>
              <input
                type="text"
                value={formData.offer}
                onChange={(e) => setFormData((prev) => ({ ...prev, offer: e.target.value }))}
                placeholder="e.g. 20% OFF"
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Texture Image (Storage)</label>
              <label className="flex items-center gap-2 w-full cursor-pointer bg-secondary border border-border rounded-lg px-3 py-2 text-sm hover:bg-accent transition-colors">
                <Upload size={14} />
                <span>{textureFile ? textureFile.name : "Choose image"}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setTextureFile(file);
                    if (file) setTexturePreview(URL.createObjectURL(file));
                  }}
                />
              </label>
              {(texturePreview || editingSkin?.textureImage) && (
                <img
                  src={texturePreview || editingSkin?.textureImage}
                  alt="Texture preview"
                  className="mt-2 h-20 w-20 object-cover rounded-md border border-border"
                />
              )}
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowAddDialog(false);
                  setEditingSkin(null);
                  resetForm();
                }}
                className="flex-1 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saveSkin.isPending}
                className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saveSkin.isPending && <Loader2 size={14} className="animate-spin" />}
                {editingSkin ? "Update" : "Add"} Skin
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSkins;
