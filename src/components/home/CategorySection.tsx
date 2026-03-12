import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { useDeviceBrands } from "@/hooks/useDevices";

import appleLogo from "@/assets/logos/apple-logo.png";
import samsungLogo from "@/assets/logos/samsung-logo.png";
import googleLogo from "@/assets/logos/google-logo.png";
import oneplusLogo from "@/assets/logos/oneplus-logo.png";
import xiaomiLogo from "@/assets/logos/xiaomi-logo.png";
import nothingLogo from "@/assets/logos/nothing-logo.png";
import motorolaLogo from "@/assets/logos/motorola-logo.png";
import realmeLogo from "@/assets/logos/realme-logo.png";
import redmiLogo from "@/assets/logos/redmi-logo.png";

const brandLogos: Record<string, string> = {
  apple: appleLogo,
  samsung: samsungLogo,
  google: googleLogo,
  oneplus: oneplusLogo,
  xiaomi: xiaomiLogo,
  nothing: nothingLogo,
  motorola: motorolaLogo,
  realme: realmeLogo,
  redmi: redmiLogo,
};

const largerLogoBrands = new Set(["apple", "samsung", "oneplus", "realme"]);
const coloredLogoBrands = new Set(["oneplus"]);

const CategorySection = () => {
  const { data: brands = [] } = useDeviceBrands();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [8, 0, -4]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.92, 1]);

  // Only show brands that have logos
  const displayBrands = brands.filter((b) => brandLogos[b.slug]);

  return (
    <section ref={ref} className="py-12 sm:py-20" style={{ perspective: "1000px" }}>
      <div className="container mx-auto px-4 sm:px-6">
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-2 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Choose Your Phone Brand
        </motion.h2>
        <motion.p
          className="text-sm sm:text-base text-muted-foreground text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
        >
          Select your brand to find the perfect mobile skin
        </motion.p>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4"
          style={{ rotateX, scale, transformStyle: "preserve-3d" }}
        >
          {displayBrands.map((brand, i) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, z: -100, rotateY: -20 }}
              whileInView={{ opacity: 1, z: 0, rotateY: 0 }}
              transition={{ delay: i * 0.08, duration: 0.6, type: "spring", stiffness: 80 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ z: 30, scale: 1.06, rotateY: 5 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Link
                to={`/devices/phones/${brand.slug}`}
                className="group block p-4 sm:p-6 md:p-8 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:bg-surface-hover transition-all duration-300 text-center hover:shadow-xl hover:shadow-primary/5"
              >
                <motion.div
                  className="flex items-center justify-center mb-3 sm:mb-4 h-14 sm:h-20"
                  whileHover={{ scale: 1.15 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={brandLogos[brand.slug]}
                    alt={`${brand.name} logo`}
                    className={`max-h-12 sm:max-h-16 max-w-[85%] object-contain ${coloredLogoBrands.has(brand.slug) ? "" : "dark:invert dark:brightness-200"}`}
                    loading="lazy"
                  />
                </motion.div>
                <h3 className="font-display font-semibold text-base sm:text-lg">{brand.name}</h3>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CategorySection;