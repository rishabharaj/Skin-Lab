import type { MaskCutout } from "@/lib/maskTemplateTypes";
import { Trash2 } from "lucide-react";

interface CutoutEditorProps {
  cutout: MaskCutout;
  onChange: (updated: MaskCutout) => void;
  onDelete: () => void;
}

const CutoutEditor = ({ cutout, onChange, onDelete }: CutoutEditorProps) => {
  const update = (key: keyof MaskCutout, value: string | number) => {
    onChange({ ...cutout, [key]: value });
  };

  return (
    <div className="rounded-lg bg-secondary/60 border border-border/40 p-3 space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <input
          type="text"
          value={cutout.label}
          onChange={(e) => update("label", e.target.value)}
          className="bg-transparent text-sm font-medium w-full outline-none focus:ring-1 focus:ring-primary rounded px-1"
        />
        <button
          onClick={onDelete}
          className="p-1 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="flex gap-2">
        <label className="text-xs text-muted-foreground">Shape</label>
        <select
          value={cutout.shape}
          onChange={(e) => update("shape", e.target.value)}
          className="flex-1 bg-background border border-border rounded px-2 py-1 text-xs"
        >
          <option value="circle">Circle</option>
          <option value="roundedRect">Rounded Rect</option>
          <option value="pill">Pill</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <SliderField label="X %" value={cutout.x} min={0} max={100} onChange={(v) => update("x", v)} />
        <SliderField label="Y %" value={cutout.y} min={0} max={100} onChange={(v) => update("y", v)} />
        <SliderField label="W %" value={cutout.width} min={1} max={100} onChange={(v) => update("width", v)} />
        <SliderField label="H %" value={cutout.height} min={0.5} max={50} step={0.5} onChange={(v) => update("height", v)} />
      </div>

      {cutout.shape === "roundedRect" && (
        <SliderField
          label="Corner Radius"
          value={cutout.cornerRadius ?? 20}
          min={0}
          max={50}
          onChange={(v) => update("cornerRadius", v)}
        />
      )}
    </div>
  );
};

function SliderField({
  label,
  value,
  min,
  max,
  step = 0.5,
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
    <div className="space-y-0.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground">{label}</span>
        <span className="text-[10px] font-mono text-foreground">{value}</span>
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

export default CutoutEditor;
