import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useAllDeviceModels, useDeviceBrands } from "@/hooks/useDevices";
import { useMaskTemplates } from "@/hooks/useMaskTemplates";
import { supabase } from "@/integrations/supabase/client";
import { renderMaskToCanvas, canvasToBlob } from "@/lib/maskRenderer";
import type { MaskTemplateConfig } from "@/lib/maskTemplateTypes";
import { Upload, Search, Check, Image as ImageIcon, Loader2, Wand2, PlayCircle, PenTool } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const AdminMasks = () => {
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [targetModelId, setTargetModelId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: brands = [] } = useDeviceBrands();
  const { data: allModels = [], isLoading } = useAllDeviceModels();
  const { data: templates = [] } = useMaskTemplates();

  const models = allModels.filter(
    (m) =>
      (!selectedBrand || m.device_brands?.slug === selectedBrand) &&
      (!search || m.name.toLowerCase().includes(search.toLowerCase()))
  );

  const handleUploadClick = (modelId: string) => {
    setTargetModelId(modelId);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !targetModelId) return;

    if (!file.type.includes("png")) {
      toast.error("Only PNG files are allowed for mask templates.");
      return;
    }

    setUploadingId(targetModelId);

    try {
      const model = allModels.find((m) => m.id === targetModelId);
      const fileName = `${model?.slug || targetModelId}.png`;

      const { error: uploadError } = await supabase.storage
        .from("phone-masks")
        .upload(fileName, file, { upsert: true, contentType: "image/png" });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("phone-masks")
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from("device_models")
        .update({ mockup_url: urlData.publicUrl })
        .eq("id", targetModelId);

      if (updateError) throw updateError;

      toast.success(`Mask uploaded for ${model?.name}`);
      queryClient.invalidateQueries({ queryKey: ["all-device-models"] });
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploadingId(null);
      setTargetModelId(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveMask = async (modelId: string) => {
    const model = allModels.find((m) => m.id === modelId);
    if (!model) return;

    try {
      await supabase.storage
        .from("phone-masks")
        .remove([`${model.slug}.png`]);

      const { error } = await supabase
        .from("device_models")
        .update({ mockup_url: null })
        .eq("id", modelId);

      if (error) throw error;

      toast.success(`Mask removed for ${model.name}`);
      queryClient.invalidateQueries({ queryKey: ["all-device-models"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to remove mask");
    }
  };

  const handleAssignTemplate = async (modelId: string, templateId: string | null) => {
    try {
      const { error } = await supabase
        .from("device_models")
        .update({ mask_template_id: templateId })
        .eq("id", modelId);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["all-device-models"] });
      toast.success("Template assigned");
    } catch (err: any) {
      toast.error(err.message || "Failed to assign template");
    }
  };

  const generateMaskForModel = async (modelId: string) => {
    const model = allModels.find((m) => m.id === modelId);
    if (!model?.mask_template_id) return;

    const { data: template, error: fetchErr } = await supabase
      .from("mask_templates")
      .select("config")
      .eq("id", model.mask_template_id)
      .single();

    if (fetchErr || !template) throw fetchErr || new Error("Template not found");

    const config = template.config as unknown as MaskTemplateConfig;
    const canvas = renderMaskToCanvas(config);
    const blob = await canvasToBlob(canvas);

    const fileName = `${model.slug}.png`;
    const { error: uploadError } = await supabase.storage
      .from("phone-masks")
      .upload(fileName, blob, { upsert: true, contentType: "image/png" });

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from("phone-masks")
      .getPublicUrl(fileName);

    const { error: updateError } = await supabase
      .from("device_models")
      .update({ mockup_url: urlData.publicUrl })
      .eq("id", modelId);

    if (updateError) throw updateError;
  };

  const handleGenerateFromTemplate = async (modelId: string) => {
    const model = allModels.find((m) => m.id === modelId);
    setGeneratingId(modelId);
    try {
      await generateMaskForModel(modelId);
      toast.success(`Mask generated for ${model?.name}`);
      queryClient.invalidateQueries({ queryKey: ["all-device-models"] });
    } catch (err: any) {
      toast.error(err.message || "Generation failed");
    } finally {
      setGeneratingId(null);
    }
  };

  const handleBatchGenerate = async () => {
    const eligible = models.filter((m) => m.mask_template_id && !m.mockup_url);
    if (eligible.length === 0) {
      toast.info("No models with assigned templates that need masks.");
      return;
    }

    setBatchProgress({ current: 0, total: eligible.length });
    let success = 0;

    for (let i = 0; i < eligible.length; i++) {
      try {
        await generateMaskForModel(eligible[i].id);
        success++;
      } catch {
        // continue on error
      }
      setBatchProgress({ current: i + 1, total: eligible.length });
    }

    setBatchProgress(null);
    toast.success(`Batch complete: ${success}/${eligible.length} masks generated`);
    queryClient.invalidateQueries({ queryKey: ["all-device-models"] });
  };

  const modelsWithMask = models.filter((m) => m.mockup_url);
  const modelsWithoutMask = models.filter((m) => !m.mockup_url);
  const modelsWithTemplate = modelsWithoutMask.filter((m) => m.mask_template_id);

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold">Mask Templates</h1>
          <p className="text-sm text-muted-foreground">
            Upload or generate PNG mask templates ({modelsWithMask.length}/{allModels.length} ready)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/admin/mask-editor")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-foreground text-sm font-medium hover:bg-surface-hover transition-colors"
          >
            <PenTool size={16} /> Template Editor
          </button>
          {modelsWithTemplate.length > 0 && (
            <button
              onClick={handleBatchGenerate}
              disabled={!!batchProgress}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <PlayCircle size={16} />
              {batchProgress
                ? `Generating ${batchProgress.current}/${batchProgress.total}...`
                : `Batch Generate (${modelsWithTemplate.length})`}
            </button>
          )}
        </div>
      </div>

      {/* Brand filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedBrand(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            !selectedBrand ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-surface-hover"
          }`}
        >
          All Brands
        </button>
        {brands.map((brand) => (
          <button
            key={brand.id}
            onClick={() => setSelectedBrand(brand.slug)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedBrand === brand.slug ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-surface-hover"
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
          placeholder="Search models..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-secondary border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Info banner */}
      <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
        <h3 className="text-sm font-semibold mb-1">How mask templates work</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Upload a PNG image where the <strong>opaque (white) area</strong> represents where the skin will be visible,
          and <strong>transparent areas</strong> represent cutouts (camera, edges, buttons).
          You can also <strong>assign a parametric template</strong> to models and click "Generate" to auto-create masks.
          Use the <strong>Template Editor</strong> to create and tweak templates visually.
        </p>
      </div>

      {/* Batch progress bar */}
      {batchProgress && (
        <div className="rounded-xl bg-card border border-primary/30 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Generating masks...</span>
            <span className="text-sm text-muted-foreground">{batchProgress.current}/{batchProgress.total}</span>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${(batchProgress.current / batchProgress.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-card border border-border/50 p-4 animate-pulse">
              <div className="aspect-[3/4] bg-secondary rounded-lg mb-3" />
              <div className="h-4 bg-secondary rounded w-2/3 mb-2" />
              <div className="h-3 bg-secondary rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Models with masks */}
          {modelsWithMask.length > 0 && (
            <div>
              <h2 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
                <Check size={18} className="text-green-500" />
                Masks Ready ({modelsWithMask.length})
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {modelsWithMask.map((model, i) => (
                  <motion.div
                    key={model.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="rounded-xl bg-card border border-green-500/20 overflow-hidden group"
                  >
                    <div className="aspect-[3/4] bg-secondary/30 relative overflow-hidden">
                      <img
                        src={model.mockup_url!}
                        alt={`${model.name} mask`}
                        className="w-full h-full object-contain p-2"
                      />
                      <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleUploadClick(model.id)}
                          className="p-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90"
                        >
                          Replace
                        </button>
                        <button
                          onClick={() => handleRemoveMask(model.id)}
                          className="p-2 rounded-lg bg-destructive text-destructive-foreground text-xs font-medium hover:opacity-90"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="p-3 border-t border-border/30">
                      <p className="text-sm font-medium truncate">{model.name}</p>
                      <p className="text-xs text-muted-foreground">{model.device_brands?.name}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Models without masks */}
          {modelsWithoutMask.length > 0 && (
            <div>
              <h2 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
                <Upload size={18} className="text-muted-foreground" />
                Needs Mask ({modelsWithoutMask.length})
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {modelsWithoutMask.map((model, i) => (
                  <motion.div
                    key={model.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="rounded-xl bg-card border border-border/50 overflow-hidden"
                  >
                    <button
                      onClick={() => handleUploadClick(model.id)}
                      disabled={uploadingId === model.id}
                      className="w-full aspect-[3/4] bg-secondary/30 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {uploadingId === model.id ? (
                        <Loader2 size={24} className="animate-spin" />
                      ) : (
                        <>
                          <ImageIcon size={24} />
                          <span className="text-xs font-medium">Upload Mask</span>
                        </>
                      )}
                    </button>
                    <div className="p-3 border-t border-border/30 space-y-2">
                      <p className="text-sm font-medium truncate">{model.name}</p>
                      <p className="text-xs text-muted-foreground">{model.device_brands?.name}</p>

                      {/* Template assignment */}
                      <select
                        value={model.mask_template_id ?? ""}
                        onChange={(e) => handleAssignTemplate(model.id, e.target.value || null)}
                        className="w-full bg-background border border-border rounded px-2 py-1 text-[11px]"
                      >
                        <option value="">No Template</option>
                        {templates.map((t) => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>

                      {/* Generate button */}
                      {model.mask_template_id && (
                        <button
                          onClick={() => handleGenerateFromTemplate(model.id)}
                          disabled={generatingId === model.id}
                          className="w-full flex items-center justify-center gap-1 px-2 py-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors text-[11px] font-medium disabled:opacity-50"
                        >
                          {generatingId === model.id ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Wand2 size={12} />
                          )}
                          Generate
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminMasks;
