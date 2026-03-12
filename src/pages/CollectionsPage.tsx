import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SkinDesign } from "@/data/mockData";
import { useActiveSkins, useSkinCollections } from "@/hooks/useSkins";
import { useCart } from "@/context/CartContext";
import { X, ShoppingCart, CreditCard, Check } from "lucide-react";
import SkinBadge from "@/components/SkinBadge";
import SkinPrice from "@/components/SkinPrice";
import CollectionFilters, { SortOption, BadgeFilter, PriceRange } from "@/components/collections/CollectionFilters";
import { toast } from "sonner";

const DEFAULT_COVERAGE = "Back Only";

const CollectionsPage = () => {
  const { data: skinDesigns = [] } = useActiveSkins();
  const { data: skinCollections = [] } = useSkinCollections();
  const [selected, setSelected] = useState<SkinDesign | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const { addItem } = useCart();
  const navigate = useNavigate();

  // Filter state
  const [search, setSearch] = useState("");
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [selectedBadges, setSelectedBadges] = useState<BadgeFilter[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<PriceRange[]>([]);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [sort, setSort] = useState<SortOption>("default");

  const toggleCollection = useCallback((id: string) => {
    setSelectedCollections((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);
  }, []);
  const toggleBadge = useCallback((b: BadgeFilter) => {
    setSelectedBadges((prev) => prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]);
  }, []);
  const togglePriceRange = useCallback((r: PriceRange) => {
    setSelectedPriceRanges((prev) => prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]);
  }, []);

  const hasActiveFilters = search !== "" || selectedCollections.length > 0 || selectedBadges.length > 0 || selectedPriceRanges.length > 0 || onSaleOnly || sort !== "default";

  const clearAll = useCallback(() => {
    setSearch("");
    setSelectedCollections([]);
    setSelectedBadges([]);
    setSelectedPriceRanges([]);
    setOnSaleOnly(false);
    setSort("default");
  }, []);

  const filteredSkins = useMemo(() => {
    let result = skinDesigns.filter((s) => {
      if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedCollections.length > 0 && !selectedCollections.includes(s.collection)) return false;
      if (selectedBadges.length > 0 && (!s.badge || !selectedBadges.includes(s.badge))) return false;
      if (selectedPriceRanges.length > 0) {
        const match = selectedPriceRanges.some((r) => {
          if (r === "under20") return s.price < 20;
          if (r === "20to30") return s.price >= 20 && s.price <= 30;
          if (r === "over30") return s.price > 30;
          return false;
        });
        if (!match) return false;
      }
      if (onSaleOnly && !s.originalPrice) return false;
      return true;
    });

    if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (sort === "name-asc") result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [search, selectedCollections, selectedBadges, selectedPriceRanges, onSaleOnly, sort]);

  // Find similar skins by matching words in the name
  const similarSkins = selected
    ? (() => {
        const words = selected.name.toLowerCase().split(/\s+/).filter(w => w.length > 2);
        return skinDesigns.filter(
          (s) =>
            s.id !== selected.id &&
            words.some((word) => s.name.toLowerCase().includes(word))
        );
      })()
    : [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">Collections</h1>
          <p className="text-muted-foreground mb-8">Explore our curated material collections</p>

          <CollectionFilters
            collections={skinCollections}
            search={search}
            setSearch={setSearch}
            selectedCollections={selectedCollections}
            toggleCollection={toggleCollection}
            selectedBadges={selectedBadges}
            toggleBadge={toggleBadge}
            selectedPriceRanges={selectedPriceRanges}
            togglePriceRange={togglePriceRange}
            onSaleOnly={onSaleOnly}
            setOnSaleOnly={setOnSaleOnly}
            sort={sort}
            setSort={setSort}
            filteredCount={filteredSkins.length}
            totalCount={skinDesigns.length}
            clearAll={clearAll}
            hasActiveFilters={hasActiveFilters}
          />

          <div className="space-y-16">
            {skinCollections.map((col) => {
              const skins = filteredSkins.filter((s) => s.collection === col.id);
              if (skins.length === 0) return null;
              return (
                <motion.div
                  key={col.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-2xl font-display font-bold mb-2">{col.name}</h2>
                  <p className="text-muted-foreground mb-6">{col.description}</p>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {skins.map((skin) => (
                      <motion.div
                        key={skin.id}
                        layoutId={`skin-${skin.id}`}
                        onClick={() => setSelected(skin)}
                        className="rounded-xl border border-border/50 hover:border-primary/30 transition-all cursor-pointer overflow-hidden relative group"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <div className="aspect-square relative">
                          <div
                            className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                            style={skin.textureImage ? { backgroundImage: `url(${skin.textureImage})` } : { backgroundColor: skin.color }}
                          />
                          {skin.badge && (
                            <div className="absolute top-1.5 left-1.5 z-10">
                              <SkinBadge badge={skin.badge} />
                            </div>
                          )}
                          {skin.offer && (
                            <div className="absolute top-1.5 right-1.5 z-10">
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-destructive text-destructive-foreground">{skin.offer}</span>
                            </div>
                          )}
                        </div>
                        <div className="p-2 bg-card">
                          <span className="text-xs font-medium block truncate">{skin.name}</span>
                          <SkinPrice price={skin.price} originalPrice={skin.originalPrice} size="sm" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />

      {/* Lightbox overlay */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <div
              className="container mx-auto px-4 py-8 pt-20"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <motion.button
                className="fixed top-6 right-6 z-50 p-2 rounded-full bg-secondary border border-border hover:bg-muted transition-colors"
                onClick={() => setSelected(null)}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} />
              </motion.button>

              {/* Selected image - large */}
              <div className="flex flex-col lg:flex-row gap-6 mb-12 items-start">
                <motion.div
                  layoutId={`skin-${selected.id}`}
                  className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-2xl overflow-hidden border border-border/50 shadow-2xl flex-shrink-0"
                >
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={selected.textureImage ? { backgroundImage: `url(${selected.textureImage})` } : { backgroundColor: selected.color }}
                  />
                </motion.div>

                <motion.div
                  className="flex-1 flex flex-col justify-center"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                   <div className="flex items-center gap-2 mb-2">
                     <span className="text-sm text-primary font-medium uppercase tracking-widest">
                       {skinCollections.find((c) => c.id === selected.collection)?.name}
                     </span>
                     {selected.badge && <SkinBadge badge={selected.badge} />}
                   </div>
                   <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                     {selected.name}
                   </h2>
                   <div className="mb-6">
                     <SkinPrice
                      price={selected.price}
                      originalPrice={selected.originalPrice}
                       offer={selected.offer}
                       size="lg"
                     />
                   </div>
                   <div className="flex gap-3">
                     <button
                       onClick={() => {
                         const cartDevice = { id: "generic", brandId: "generic", name: "Any Device", category: "phones", image: "" };
                         addItem(cartDevice, selected, DEFAULT_COVERAGE);
                         setAddedId(selected.id);
                         toast.success(`${selected.name} added to cart!`);
                         setTimeout(() => setAddedId(null), 1500);
                       }}
                       className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-secondary text-foreground font-display font-semibold text-sm hover:bg-muted transition-colors border border-border"
                     >
                       {addedId === selected.id ? <Check size={18} /> : <ShoppingCart size={18} />}
                       {addedId === selected.id ? "Added!" : "Add to Cart"}
                     </button>
                     <button
                       onClick={() => {
                         const cartDevice = { id: "generic", brandId: "generic", name: "Any Device", category: "phones", image: "" };
                         addItem(cartDevice, selected, DEFAULT_COVERAGE);
                         toast.success(`${selected.name} added to cart!`);
                         navigate("/checkout");
                       }}
                       className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm hover:opacity-90 transition-opacity"
                     >
                       <CreditCard size={18} />
                       Buy Now
                     </button>
                   </div>
                 </motion.div>
               </div>

              {/* Similar skins */}
              {similarSkins.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-xl font-display font-bold mb-6">
                    Similar Designs
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {similarSkins.map((skin, i) => (
                      <motion.div
                        key={skin.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 + i * 0.06 }}
                        onClick={() => setSelected(skin)}
                        className="aspect-square rounded-xl border border-border/50 hover:border-primary/30 transition-all cursor-pointer overflow-hidden relative group"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <div
                          className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                          style={skin.textureImage ? { backgroundImage: `url(${skin.textureImage})` } : { backgroundColor: skin.color }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                          <span className="text-xs font-medium">{skin.name}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollectionsPage;