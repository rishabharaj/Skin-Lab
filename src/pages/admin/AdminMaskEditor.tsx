import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Save, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useMaskTemplates, useMaskTemplate, useSaveMaskTemplate } from "@/hooks/useMaskTemplates";
import CanvasPreview from "@/components/admin/CanvasPreview";
import CutoutEditor from "@/components/admin/CutoutEditor";
import type { MaskTemplateConfig, MaskCutout } from "@/lib/maskTemplateTypes";

const DEFAULT_CONFIG: MaskTemplateConfig = {
  version: 1,
  canvasWidth: 400,
  canvasHeight: 820,
  body: { insetX: 10, insetY: 10, cornerRadii: [34, 34, 34, 34] },
  cutouts: [],
};

const AdminMaskEditor = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const { data: templates = [] } = useMaskTemplates();
  const { data: existingTemplate } = useMaskTemplate(templateId);
  const saveMutation = useSaveMaskTemplate();

  const [name, setName] = useState("New Template");
  const [description, setDescription] = useState("");
  const [brandHint, setBrandHint] = useState("");
  const [config, setConfig] = useState<MaskTemplateConfig>(DEFAULT_CONFIG);
  const [showSkinOverlay, setShowSkinOverlay] = useState(false);

  // Load existing template
  useEffect(() => {
    if (existingTemplate) {
      setName(existingTemplate.name);
      setDescription(existingTemplate.description ?? "");
      setBrandHint(existingTemplate.brand_hint ?? "");
      setConfig(existingTemplate.config);
    }
  }, [existingTemplate]);

  const updateBody = (key: string, value: number) => {
    setConfig((prev) => ({
      ...prev,
      body: { ...prev.body, [key]: value },
    }));
  };

  const updateCornerRadius = (index: number, value: number) => {
    setConfig((prev) => {
      const radii = [...prev.body.cornerRadii] as [number, number, number, number];
      radii[index] = value;
      return { ...prev, body: { ...prev.body, cornerRadii: radii } };
    });
  };

  const updateCutout = (index: number, updated: MaskCutout) => {
    setConfig((prev) => {
      const cutouts = [...prev.cutouts];
      cutouts[index] = updated;
      return { ...prev, cutouts };
    });
  };

  const addCutout = () => {
    const newCutout: MaskCutout = {
      id: `cutout-${Date.now()}`,
      label: "New Cutout",
      shape: "circle",
      x: 10,
      y: 10,
      width: 10,
      height: 6,
    };
    setConfig((prev) => ({ ...prev, cutouts: [...prev.cutouts, newCutout] }));
  };

  const removeCutout = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      cutouts: prev.cutouts.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    try {
      await saveMutation.mutateAsync({
        id: templateId,
        name,
        description,
        brand_hint: brandHint,
        config,
      });
      toast.success("Template saved!");
      if (!templateId) {
        navigate("/admin/mask-editor");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save template");
    }
  };

  // Sample skin texture for overlay preview
  const sampleSkin = showSkinOverlay
    ? "data:image/svg+xml," + encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="820">
          <defs>
            <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#6366f1"/>
              <stop offset="50%" style="stop-color:#ec4899"/>
              <stop offset="100%" style="stop-color:#f59e0b"/>
            </linearGradient>
          </defs>
          <rect width="400" height="820" fill="url(#g)"/>
        </svg>`
      )
    : undefined;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/masks")}
            className="p-2 rounded-lg bg-secondary hover:bg-surface-hover transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-display font-bold">Mask Editor</h1>
            <p className="text-sm text-muted-foreground">
              {templateId ? `Editing: ${name}` : "Create or select a template"}
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saveMutation.isPending}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Save size={16} />
          {saveMutation.isPending ? "Saving..." : "Save Template"}
        </button>
      </div>

      {/* Template quick-switch (only when not editing a specific one) */}
      {!templateId && templates.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <span className="text-xs text-muted-foreground whitespace-nowrap">Quick edit:</span>
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => navigate(`/admin/mask-editor/${t.id}`)}
              className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap bg-secondary hover:bg-surface-hover transition-colors"
            >
              {t.name}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* Preview */}
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-2xl bg-card border border-border/50 p-6 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setShowSkinOverlay(!showSkinOverlay)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-secondary hover:bg-surface-hover transition-colors"
              >
                {showSkinOverlay ? <EyeOff size={14} /> : <Eye size={14} />}
                {showSkinOverlay ? "Hide Skin" : "Show Skin"}
              </button>
            </div>
            <CanvasPreview config={config} skinTextureUrl={sampleSkin} width={280} height={570} />
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-4 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-2">
          {/* Template info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl bg-card border border-border/50 p-4 space-y-3"
          >
            <h3 className="text-sm font-semibold">Template Info</h3>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Template name"
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <input
              type="text"
              value={brandHint}
              onChange={(e) => setBrandHint(e.target.value)}
              placeholder="Brand hint (apple, samsung...)"
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </motion.div>

          {/* Body shape */}
          <div className="rounded-xl bg-card border border-border/50 p-4 space-y-3">
            <h3 className="text-sm font-semibold">Body Shape</h3>
            <div className="grid grid-cols-2 gap-3">
              <SliderControl label="Inset X" value={config.body.insetX} min={0} max={50} onChange={(v) => updateBody("insetX", v)} />
              <SliderControl label="Inset Y" value={config.body.insetY} min={0} max={50} onChange={(v) => updateBody("insetY", v)} />
            </div>
            <h4 className="text-xs text-muted-foreground mt-2">Corner Radii</h4>
            <div className="grid grid-cols-2 gap-3">
              <SliderControl label="Top-Left" value={config.body.cornerRadii[0]} min={0} max={60} onChange={(v) => updateCornerRadius(0, v)} />
              <SliderControl label="Top-Right" value={config.body.cornerRadii[1]} min={0} max={60} onChange={(v) => updateCornerRadius(1, v)} />
              <SliderControl label="Bottom-Right" value={config.body.cornerRadii[2]} min={0} max={60} onChange={(v) => updateCornerRadius(2, v)} />
              <SliderControl label="Bottom-Left" value={config.body.cornerRadii[3]} min={0} max={60} onChange={(v) => updateCornerRadius(3, v)} />
            </div>
          </div>

          {/* Cutouts */}
          <div className="rounded-xl bg-card border border-border/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Cutouts ({config.cutouts.length})</h3>
              <button
                onClick={addCutout}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
              >
                <Plus size={14} /> Add
              </button>
            </div>
            <div className="space-y-2">
              {config.cutouts.map((cutout, i) => (
                <CutoutEditor
                  key={cutout.id}
                  cutout={cutout}
                  onChange={(updated) => updateCutout(i, updated)}
                  onDelete={() => removeCutout(i)}
                />
              ))}
              {config.cutouts.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4">No cutouts yet. Click "Add" to create one.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function SliderControl({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-[11px] text-muted-foreground">{label}</span>
        <span className="text-[11px] font-mono">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 accent-primary"
      />
    </div>
  );
}

export default AdminMaskEditor;
