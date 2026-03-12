import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, X, ShoppingCart, CreditCard, Check } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";
import { SkinDesign } from "@/data/mockData";
import { useMemo, useRef, useState } from "react";
import { useActiveSkins, useHomepageSkins, useSkinCollections } from "@/hooks/useSkins";
import { useCart } from "@/context/CartContext";
import SkinBadge from "@/components/SkinBadge";
import SkinPrice from "@/components/SkinPrice";
import { toast } from "sonner";

const DEFAULT_COVERAGE = "Back Only";

const HeroSection = () => {
  const { data: skinDesigns = [] } = useActiveSkins();
  const { data: homepageSkins = [] } = useHomepageSkins();
  const { data: skinCollections = [] } = useSkinCollections();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const [selected, setSelected] = useState<SkinDesign | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const { addItem } = useCart();
  const navigate = useNavigate();

  const featuredSkins = useMemo(() => {
    if (homepageSkins.length > 0) return homepageSkins.slice(0, 10);
    const priority = skinDesigns.filter((s) => s.badge || s.offer || !!s.textureImage);
    return (priority.length > 0 ? priority : skinDesigns).slice(0, 10);
  }, [homepageSkins, skinDesigns]);

  const carouselSkins = [...featuredSkins, ...featuredSkins];

  const handleSelect = (skin: SkinDesign) => {
    setSelected(skin);
  };

  return (
    <>
      <section ref={ref} className="relative min-h-[85vh] sm:min-h-[90vh] flex flex-col items-center justify-center overflow-hidden" style={{ perspective: "1200px" }}>
        <motion.div
          className="absolute inset-0"
          style={{ y: bgY, scale: bgScale }}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <img src={heroBanner} alt="Premium mobile skins" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </motion.div>

        <motion.div
          className="container mx-auto px-4 sm:px-6 relative z-10 text-center"
          style={{ y: textY, opacity }}
        >
          <motion.span
            className="inline-block text-xs sm:text-sm font-medium text-primary mb-4 sm:mb-6 tracking-widest uppercase"
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Premium Device Skins
          </motion.span>

          <motion.h1
            className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[0.9] mb-4 sm:mb-6 tracking-tight"
            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <span className="inline-flex flex-wrap justify-center">
              {"Your Device.".split("").map((char, i) => (
                <motion.span
                  key={`d-${i}`}
                  className="inline-block hero-wave-char"
                  animate={{ y: [0, -12, 0] }}
                  transition={{
                    duration: 0.6,
                    delay: 1.5 + i * 0.07,
                    repeat: Infinity,
                    repeatDelay: 4,
                    ease: "easeInOut",
                  }}
                  style={{ whiteSpace: char === " " ? "pre" : undefined }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </span>
            <br />
            <span className="text-primary inline-flex flex-wrap justify-center">
              {"Your Style.".split("").map((char, i) => (
                <motion.span
                  key={`s-${i}`}
                  className="inline-block hero-wave-char"
                  animate={{ y: [0, -12, 0] }}
                  transition={{
                    duration: 0.6,
                    delay: 1.5 + i * 0.07,
                    repeat: Infinity,
                    repeatDelay: 4,
                    ease: "easeInOut",
                  }}
                  style={{ whiteSpace: char === " " ? "pre" : undefined }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </span>
          </motion.h1>

          <motion.p
            className="text-sm sm:text-lg md:text-xl text-muted-foreground max-w-xs sm:max-w-xl mx-auto mb-6 sm:mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, delay: 1.5 }}
          >
            Precision-cut vinyl skins for 500+ phone models. Transform your smartphone in seconds.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 1.7 }}
          >
            <motion.div
              initial={{ opacity: 0, x: -40, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.7, type: "spring", stiffness: 120, damping: 12 }}
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px hsl(var(--primary) / 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="rounded-lg"
            >
              <Link
                to="/devices/phones"
                className="group inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-display font-semibold text-sm transition-all w-full"
              >
                Shop Now
                <motion.span
                  className="inline-block"
                  animate={{ x: [0, 6, 0] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                >
                  <ArrowRight size={18} />
                </motion.span>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.85, type: "spring", stiffness: 120, damping: 12 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-lg"
            >
              <Link
                to="/collections"
                className="inline-flex items-center justify-center gap-2 border border-border px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-display font-semibold text-sm hover:bg-secondary transition-colors w-full"
              >
                Browse Collections
              </Link>
            </motion.div>
          </motion.div>

        </motion.div>

        {/* Keep carousel outside the parallax text wrapper so it doesn't drift on scroll. */}
        <motion.div
          className="container mx-auto px-4 sm:px-6 relative z-10 mt-10 sm:mt-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.8 }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="overflow-hidden max-w-xs sm:max-w-4xl mx-auto">
            <motion.div
              className="flex gap-3 sm:gap-4"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 30,
                  ease: "linear",
                },
              }}
              style={{ animationPlayState: isPaused ? "paused" : "running" }}
            >
              {carouselSkins.map((skin, i) => (
                <motion.div
                  key={`${skin.id}-${i}`}
                  className="aspect-[3/4] w-32 sm:w-40 md:w-44 flex-shrink-0 rounded-lg sm:rounded-xl border border-border/50 cursor-pointer overflow-hidden relative shadow-lg group"
                  whileHover={{
                    y: -12,
                    scale: 1.08,
                    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
                    transition: { duration: 0.3 },
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelect(skin)}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                    style={skin.textureImage ? { backgroundImage: `url(${skin.textureImage})` } : { backgroundColor: skin.color }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

                  {/* Badge */}
                  {skin.badge && (
                    <div className="absolute top-2 left-2 z-10">
                      <SkinBadge badge={skin.badge} />
                    </div>
                  )}

                  {/* Bottom info */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 z-10">
                    <span className="text-[10px] sm:text-xs font-semibold text-foreground block mb-1 truncate">
                      {skin.name}
                    </span>
                    <SkinPrice price={skin.price} originalPrice={skin.originalPrice} offer={skin.offer} size="sm" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Detail Overlay */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" onClick={() => setSelected(null)} />
            <motion.div
              className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 sm:p-10"
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col md:flex-row gap-8 items-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-64 h-64 sm:w-80 sm:h-80 rounded-2xl overflow-hidden border border-border/50 shadow-2xl flex-shrink-0"
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

              {/* Similar Skins */}
              {(() => {
                const words = selected.name.toLowerCase().split(/\s+/).filter(w => w.length > 2);
                const similar = skinDesigns.filter(
                  (s) => s.id !== selected.id && (s.collection === selected.collection || words.some((word) => s.name.toLowerCase().includes(word)))
                ).slice(0, 8);
                if (similar.length === 0) return null;
                return (
                  <motion.div
                    className="mt-8 pt-6 border-t border-border"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="text-lg font-display font-bold mb-4">Similar Designs</h3>
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                      {similar.map((skin, i) => (
                        <motion.div
                          key={skin.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.35 + i * 0.04 }}
                          onClick={() => handleSelect(skin)}
                          className="aspect-square rounded-lg border border-border/50 hover:border-primary/30 transition-all cursor-pointer overflow-hidden relative group"
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div
                            className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                            style={skin.textureImage ? { backgroundImage: `url(${skin.textureImage})` } : { backgroundColor: skin.color }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1.5">
                            <span className="text-[9px] font-medium truncate">{skin.name}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HeroSection;
