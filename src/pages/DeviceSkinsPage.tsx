import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useActiveSkins, useSkinCollections } from "@/hooks/useSkins";
import { useDeviceModel } from "@/hooks/useDevices";
import { useCart } from "@/context/CartContext";
import { ChevronRight, ShoppingCart, Check, Filter, Heart, CreditCard } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { toast } from "sonner";
import SkinPreview from "@/components/SkinPreview";
import SkinBadge from "@/components/SkinBadge";
import SkinPrice from "@/components/SkinPrice";

const DEFAULT_COVERAGE = "Back Only";

const DeviceSkinsPage = () => {
  const { category, brandId, modelId } = useParams();
  const { addItem } = useCart();
  const { data: modelData, isLoading } = useDeviceModel(modelId);
  const { data: skinDesigns = [] } = useActiveSkins();
  const { data: skinCollections = [] } = useSkinCollections();
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [selectedSkin, setSelectedSkin] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const { toggleWishlist, isWishlisted } = useWishlist();
  const previewRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const filteredSkins = selectedCollection
    ? skinDesigns.filter((s) => s.collection === selectedCollection)
    : skinDesigns;

  const activeSkin = skinDesigns.find((s) => s.id === selectedSkin);

  useEffect(() => {
    if (filteredSkins.length === 0) {
      setSelectedSkin(null);
      return;
    }
    const selectedStillVisible = selectedSkin && filteredSkins.some((s) => s.id === selectedSkin);
    if (!selectedStillVisible) {
      setSelectedSkin(filteredSkins[0].id);
    }
  }, [filteredSkins, selectedSkin]);

  if (isLoading) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="h-8 bg-secondary rounded w-48 mb-8 animate-pulse" />
          <div className="h-12 bg-secondary rounded w-64 mb-12 animate-pulse" />
        </div>
      </main>
    </div>
  );

  const brand = modelData?.device_brands;
  const model = modelData;

  if (!brand || !model) return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Device not found</div>;

  // Create a compatible model object for the cart
  const cartModel = {
    id: model.slug,
    brandId: brand.slug,
    name: model.name,
    category: "phones",
    image: model.image_url || "",
  };

  const handleAddToCart = (skinId: string) => {
    const skin = skinDesigns.find((s) => s.id === skinId);
    if (!skin) return;
    addItem(cartModel, skin, DEFAULT_COVERAGE);
    setAddedId(skinId);
    toast.success(`${skin.name} added to cart!`);
    setTimeout(() => setAddedId(null), 1500);
  };

  const handleBuyNow = (skinId: string) => {
    handleAddToCart(skinId);
    navigate("/checkout");
  };

  const handleSelectSkin = (skinId: string) => {
    setSelectedSkin(skinId);
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      // On smaller screens preview sits below the grid, so scroll it into view.
      setTimeout(() => previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
    }
  };

  const price = activeSkin ? activeSkin.price : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8 flex-wrap">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to={`/devices/${category}`} className="hover:text-foreground transition-colors capitalize">{category}</Link>
            <ChevronRight size={14} />
            <Link to={`/devices/${category}/${brandId}`} className="hover:text-foreground transition-colors">{brand.name}</Link>
            <ChevronRight size={14} />
            <span className="text-foreground">{model.name}</span>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-8 xl:gap-10">
            {/* Skin grid */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl md:text-4xl font-display font-bold">{model.name} Skins</h1>
                <span className="text-sm text-muted-foreground">{filteredSkins.length} designs</span>
              </div>

              {/* Collection filter */}
              <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
                <Filter size={16} className="text-muted-foreground flex-shrink-0" />
                <button
                  onClick={() => setSelectedCollection(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    !selectedCollection ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-surface-hover"
                  }`}
                >
                  All
                </button>
                {skinCollections.map((col) => (
                  <button
                    key={col.id}
                    onClick={() => setSelectedCollection(col.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedCollection === col.id ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-surface-hover"
                    }`}
                  >
                    {col.name}
                  </button>
                ))}
              </div>

              {/* Skins grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 justify-items-center">
                <AnimatePresence mode="popLayout">
                  {filteredSkins.map((skin) => (
                    <motion.div
                      key={skin.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className={`group relative w-full max-w-[210px] rounded-xl border cursor-pointer transition-all duration-300 overflow-hidden ${
                        selectedSkin === skin.id ? "border-primary glow-border" : "border-border/50 hover:border-border"
                      }`}
                      onClick={() => handleSelectSkin(skin.id)}
                    >
                      <div className="aspect-[3/4] bg-cover bg-center relative"
                        style={skin.textureImage ? { backgroundImage: `url(${skin.textureImage})` } : { backgroundColor: skin.color }}
                      >
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
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(skin.id);
                          }}
                          className="absolute bottom-1.5 right-1.5 z-10 p-1.5 rounded-full bg-background/70 backdrop-blur-sm hover:bg-background transition-colors"
                        >
                          <Heart size={14} className={isWishlisted(skin.id) ? "fill-destructive text-destructive" : "text-foreground"} />
                        </button>
                      </div>
                      <div className="p-2.5 bg-card">
                        <h3 className="text-sm font-medium truncate">{skin.name}</h3>
                        <p className="text-xs text-muted-foreground capitalize">{skin.collection}</p>
                        <div className="flex items-center justify-between mt-2">
                          <SkinPrice price={skin.price} originalPrice={skin.originalPrice} size="sm" />
                        </div>
                        <div className="grid grid-cols-2 gap-1.5 mt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(skin.id);
                            }}
                            className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors text-[11px] font-medium"
                          >
                            {addedId === skin.id ? <><Check size={12} /> Added</> : <><ShoppingCart size={12} /> Cart</>}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBuyNow(skin.id);
                            }}
                            className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity text-[11px] font-medium"
                          >
                            <CreditCard size={12} /> Buy
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Preview panel */}
            <div ref={previewRef} className="lg:sticky lg:top-20 lg:self-start">
              <div className="rounded-xl border border-border/50 bg-card p-4 sm:p-5 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
                <h2 className="font-display font-semibold mb-3">Preview</h2>
                
                {/* Device preview with mask */}
                <div className="relative h-[220px] sm:h-[280px] md:h-[320px] lg:h-[300px] rounded-2xl overflow-hidden mb-3 bg-secondary">
                  {activeSkin ? (
                    <SkinPreview
                      maskUrl={model.mockup_url}
                      templateConfig={(model as any).mask_templates?.config}
                      skinImage={activeSkin.textureImage}
                      skinColor={activeSkin.color}
                      modelName={model.name}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <span className="text-6xl block mb-4">📱</span>
                        <p className="text-sm">Select a skin to preview</p>
                      </div>
                    </div>
                  )}
                </div>

                {activeSkin && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-display font-semibold text-lg">{activeSkin.name}</h3>
                      {activeSkin.badge && <SkinBadge badge={activeSkin.badge} />}
                    </div>
                    <p className="text-sm text-muted-foreground capitalize mb-2">{activeSkin.collection} Collection</p>

                    <div className="mb-2">
                      <SkinPrice
                        price={price}
                        originalPrice={activeSkin.originalPrice}
                        offer={activeSkin.offer}
                        size="lg"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleAddToCart(activeSkin.id)}
                        className="flex-1 bg-secondary text-foreground py-3 rounded-lg font-display font-semibold text-sm hover:bg-muted transition-colors border border-border flex items-center justify-center gap-2"
                      >
                        <ShoppingCart size={18} />
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleBuyNow(activeSkin.id)}
                        className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-display font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                      >
                        <CreditCard size={18} />
                        Buy Now
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DeviceSkinsPage;
