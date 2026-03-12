import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useMemo, useRef } from "react";
import { useActiveSkins, useSkinCollections } from "@/hooks/useSkins";

const TrendingSection = () => {
  const { data: skinDesigns = [] } = useActiveSkins();
  const { data: skinCollections = [] } = useSkinCollections();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const collectionCovers = useMemo(() => {
    const covers: Record<string, string> = {};
    skinCollections.forEach((col) => {
      const firstSkin = skinDesigns.find((s) => s.collection === col.id && s.textureImage);
      if (firstSkin) covers[col.id] = firstSkin.textureImage;
    });
    return covers;
  }, [skinDesigns]);

  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [6, 0, -3]);
  const y = useTransform(scrollYProgress, [0, 0.5], [40, 0]);

  return (
    <section ref={ref} className="py-12 sm:py-20 bg-card/30" style={{ perspective: "1200px" }}>
      <div className="container mx-auto px-4 sm:px-6">
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-2 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Skin Collections
        </motion.h2>
        <motion.p
          className="text-sm sm:text-base text-muted-foreground text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
        >
          Explore our curated material collections
        </motion.p>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4"
          style={{ rotateX, y, transformStyle: "preserve-3d" }}
        >
          {skinCollections.map((col, i) => (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, z: -80, rotateX: 10 }}
              whileInView={{ opacity: 1, z: 0, rotateX: 0 }}
              transition={{ delay: i * 0.06, duration: 0.6, type: "spring", stiffness: 70 }}
              viewport={{ once: true, margin: "-40px" }}
              whileHover={{ z: 20, scale: 1.03 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Link
                to="/collections"
                className="group relative block aspect-[4/3] rounded-xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all hover:shadow-2xl hover:shadow-primary/10"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent z-10" />
                <motion.div
                  className="absolute inset-0 bg-cover bg-center"
                  style={
                    collectionCovers[col.id]
                      ? { backgroundImage: `url(${collectionCovers[col.id]})` }
                      : { backgroundColor: "hsl(var(--secondary))" }
                  }
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5 z-20">
                  <h3 className="font-display font-semibold text-sm sm:text-lg">{col.name}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">{col.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrendingSection;
