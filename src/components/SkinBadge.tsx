import { Flame, TrendingUp, Sparkles } from "lucide-react";

interface SkinBadgeProps {
  badge?: "trending" | "bestseller" | "new";
  className?: string;
}

const badgeConfig = {
  trending: { label: "Trending", icon: TrendingUp, bg: "bg-destructive", text: "text-destructive-foreground" },
  bestseller: { label: "Best Seller", icon: Flame, bg: "bg-primary", text: "text-primary-foreground" },
  new: { label: "New", icon: Sparkles, bg: "bg-accent", text: "text-accent-foreground" },
};

const SkinBadge = ({ badge, className = "" }: SkinBadgeProps) => {
  if (!badge) return null;
  const config = badgeConfig[badge];
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${config.bg} ${config.text} ${className}`}>
      <Icon size={10} />
      {config.label}
    </span>
  );
};

export default SkinBadge;
