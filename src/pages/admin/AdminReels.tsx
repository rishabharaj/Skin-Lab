import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVideoReels, VideoReel } from "@/hooks/useVideoReels";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import {
  Plus, Trash2, Pencil, Upload, Loader2, GripVertical,
  Eye, EyeOff, X, Check, Video,
} from "lucide-react";
import { toast } from "sonner";

const AdminReels = () => {
  const { data: reels = [], isLoading } = useVideoReels(false);
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", video_url: "", sort_order: 0 });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const resetForm = () => {
    setForm({ title: "", description: "", video_url: "", sort_order: 0 });
    setEditingId(null);
    setShowForm(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast.error("Only video files are allowed.");
      return;
    }

    setUploading(true);
    try {
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const { error: uploadError } = await supabase.storage
        .from("video-reels")
        .upload(fileName, file, { contentType: file.type });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("video-reels")
        .getPublicUrl(fileName);

      setForm((prev) => ({ ...prev, video_url: urlData.publicUrl }));
      toast.success("Video uploaded!");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.video_url.trim()) {
      toast.error("Title and video are required.");
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from("video_reels")
          .update({
            title: form.title,
            description: form.description || null,
            video_url: form.video_url,
            sort_order: form.sort_order,
          })
          .eq("id", editingId);
        if (error) throw error;
        toast.success("Reel updated!");
      } else {
        const { error } = await supabase
          .from("video_reels")
          .insert({
            title: form.title,
            description: form.description || null,
            video_url: form.video_url,
            sort_order: form.sort_order,
          });
        if (error) throw error;
        toast.success("Reel added!");
      }
      queryClient.invalidateQueries({ queryKey: ["video-reels"] });
      resetForm();
    } catch (err: any) {
      toast.error(err.message || "Save failed");
    }
  };

  const handleEdit = (reel: VideoReel) => {
    setForm({
      title: reel.title,
      description: reel.description || "",
      video_url: reel.video_url,
      sort_order: reel.sort_order,
    });
    setEditingId(reel.id);
    setShowForm(true);
  };

  const handleToggleActive = async (reel: VideoReel) => {
    const { error } = await supabase
      .from("video_reels")
      .update({ is_active: !reel.is_active })
      .eq("id", reel.id);
    if (error) {
      toast.error("Failed to toggle status");
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["video-reels"] });
    toast.success(reel.is_active ? "Reel hidden" : "Reel visible");
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const { error } = await supabase.from("video_reels").delete().eq("id", id);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["video-reels"] });
      toast.success("Reel deleted");
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleFileUpload}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Video Reels</h1>
          <p className="text-sm text-muted-foreground">
            Manage homepage video reels ({reels.length} total)
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> Add Reel
        </button>
      </div>

      {/* Add/Edit form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-border/50 bg-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-semibold">
                  {editingId ? "Edit Reel" : "Add New Reel"}
                </h3>
                <button onClick={resetForm} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Carbon Fiber Install"
                    className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Description</label>
                  <input
                    type="text"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="e.g. Galaxy S25 Ultra"
                    className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[1fr_120px] gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Video *</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={form.video_url}
                      onChange={(e) => setForm({ ...form, video_url: e.target.value })}
                      placeholder="Video URL or upload a file"
                      className="flex-1 bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="flex items-center gap-2 bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm hover:bg-surface-hover transition-colors disabled:opacity-50"
                    >
                      {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                      Upload
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Sort Order</label>
                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                    className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Video preview */}
              {form.video_url && (
                <div className="rounded-lg overflow-hidden bg-secondary max-w-xs">
                  <video
                    src={form.video_url}
                    className="w-full aspect-[9/16] object-cover"
                    muted
                    playsInline
                    controls
                  />
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  onClick={resetForm}
                  className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <Check size={16} />
                  {editingId ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reels list */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-card border border-border/50 p-4 flex gap-4 animate-pulse">
              <div className="w-20 h-36 bg-secondary rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-secondary rounded w-40" />
                <div className="h-4 bg-secondary rounded w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : reels.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
          <Video size={40} className="mx-auto mb-4 text-muted-foreground/30" />
          <p className="text-muted-foreground">No video reels yet. Click "Add Reel" to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reels.map((reel, i) => (
            <motion.div
              key={reel.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-xl border bg-card overflow-hidden flex gap-4 p-4 ${
                reel.is_active ? "border-border/50" : "border-border/30 opacity-60"
              }`}
            >
              {/* Video thumbnail */}
              <div className="w-20 h-36 flex-shrink-0 rounded-lg overflow-hidden bg-secondary">
                <video
                  src={reel.video_url}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                  preload="metadata"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-medium text-sm">{reel.title}</h3>
                    {reel.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{reel.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-muted-foreground">
                        Order: {reel.sort_order}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        reel.is_active
                          ? "bg-green-500/10 text-green-500"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {reel.is_active ? "Active" : "Hidden"}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleToggleActive(reel)}
                      className="p-2 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                      title={reel.is_active ? "Hide" : "Show"}
                    >
                      {reel.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button
                      onClick={() => handleEdit(reel)}
                      className="p-2 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(reel.id)}
                      disabled={deletingId === reel.id}
                      className="p-2 rounded-md hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive disabled:opacity-50"
                    >
                      {deletingId === reel.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReels;
