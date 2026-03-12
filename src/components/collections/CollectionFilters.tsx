import { useState } from "react";
import { Search, X, SlidersHorizontal, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { AnimatePresence, motion } from "framer-motion";
import type { SkinCollection } from "@/hooks/useSkins";

export type SortOption = "default" | "price-asc" | "price-desc" | "name-asc";
export type BadgeFilter = "trending" | "bestseller" | "new";
export type PriceRange = "under20" | "20to30" | "over30";

interface CollectionFiltersProps {
  collections: SkinCollection[];
  search: string;
  setSearch: (v: string) => void;
  selectedCollections: string[];
  toggleCollection: (id: string) => void;
  selectedBadges: BadgeFilter[];
  toggleBadge: (b: BadgeFilter) => void;
  selectedPriceRanges: PriceRange[];
  togglePriceRange: (r: PriceRange) => void;
  onSaleOnly: boolean;
  setOnSaleOnly: (v: boolean) => void;
  sort: SortOption;
  setSort: (v: SortOption) => void;
  filteredCount: number;
  totalCount: number;
  clearAll: () => void;
  hasActiveFilters: boolean;
}

const badgeOptions: { value: BadgeFilter; label: string }[] = [
  { value: "trending", label: "🔥 Trending" },
  { value: "bestseller", label: "⭐ Best Seller" },
  { value: "new", label: "✨ New" },
];

const priceOptions: { value: PriceRange; label: string }[] = [
  { value: "under20", label: "Under $20" },
  { value: "20to30", label: "$20 – $30" },
  { value: "over30", label: "$30+" },
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "name-asc", label: "Name: A → Z" },
];

const Chip = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`text-xs px-3 py-1.5 rounded-full border transition-colors whitespace-nowrap ${
      active
        ? "bg-primary/10 border-primary/40 text-foreground font-semibold"
        : "bg-secondary/50 border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/40"
    }`}
  >
    {children}
  </button>
);

const CollectionFilters = ({
  collections,
  search,
  setSearch,
  selectedCollections,
  toggleCollection,
  selectedBadges,
  toggleBadge,
  selectedPriceRanges,
  togglePriceRange,
  onSaleOnly,
  setOnSaleOnly,
  sort,
  setSort,
  filteredCount,
  totalCount,
  clearAll,
  hasActiveFilters,
}: CollectionFiltersProps) => {
  const [open, setOpen] = useState(false);

  const activeCount =
    selectedCollections.length +
    selectedBadges.length +
    selectedPriceRanges.length +
    (onSaleOnly ? 1 : 0) +
    (sort !== "default" ? 1 : 0);

  return (
    <div className="mb-10 space-y-3">
      {/* Search + Filter toggle row */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search skins..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-secondary/50 border-border"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <button
          onClick={() => setOpen(!open)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
            open || activeCount > 0
              ? "bg-primary/10 border-primary/40 text-foreground"
              : "bg-secondary/50 border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/40"
          }`}
        >
          <SlidersHorizontal size={16} />
          Filters
          {activeCount > 0 && (
            <span className="ml-1 text-[10px] font-bold bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center">
              {activeCount}
            </span>
          )}
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Collapsible filter panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-xl border border-border bg-card/50 space-y-4">
              {/* Collections */}
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                  Collection
                </span>
                <div className="flex flex-wrap gap-2">
                  {collections.map((col) => (
                    <Chip
                      key={col.id}
                      active={selectedCollections.includes(col.id)}
                      onClick={() => toggleCollection(col.id)}
                    >
                      {col.name}
                    </Chip>
                  ))}
                </div>
              </div>

              {/* Badges */}
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                  Badge
                </span>
                <div className="flex flex-wrap gap-2">
                  {badgeOptions.map((b) => (
                    <Chip
                      key={b.value}
                      active={selectedBadges.includes(b.value)}
                      onClick={() => toggleBadge(b.value)}
                    >
                      {b.label}
                    </Chip>
                  ))}
                </div>
              </div>

              {/* Price + On Sale + Sort */}
              <div className="flex flex-wrap items-end gap-6">
                <div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                    Price
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {priceOptions.map((p) => (
                      <Chip
                        key={p.value}
                        active={selectedPriceRanges.includes(p.value)}
                        onClick={() => togglePriceRange(p.value)}
                      >
                        {p.label}
                      </Chip>
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer pb-0.5">
                  <Switch checked={onSaleOnly} onCheckedChange={setOnSaleOnly} />
                  <span className="text-xs font-medium text-muted-foreground">On Sale</span>
                </label>

                <div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                    Sort
                  </span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortOption)}
                    className="text-xs bg-secondary/50 border border-border rounded-md px-2 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {sortOptions.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results count + Clear */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filteredCount}</span> of {totalCount} skins
        </span>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-destructive hover:underline font-medium flex items-center gap-1"
          >
            <X size={14} />
            Clear All
          </button>
        )}
      </div>
    </div>
  );
};

export default CollectionFilters;
