import { Scissors, Shield, Truck } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const features = [
  { icon: Scissors, title: "Precision Cut", desc: "Laser-cut for a perfect fit on every device" },
  { icon: Shield, title: "3M Material", desc: "Premium 3M vinyl that protects without bulk" },
  { icon: Truck, title: "Free Shipping", desc: "Free worldwide shipping on orders over $50" },
];

const FeaturesSection = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [10, 0, -5]);
  const scale = useTransform(scrollYProgress, [0, 0.4], [0.9, 1]);

  return (
    <section ref={ref} className="py-12 sm:py-20" style={{ perspective: "1000px" }}>
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          className="grid grid-cols-3 gap-4 sm:gap-6"
          style={{ rotateX, scale, transformStyle: "preserve-3d" }}
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="text-center p-4 sm:p-6 rounded-xl"
              initial={{ opacity: 0, z: -60, rotateY: i % 2 === 0 ? -15 : 15 }}
              whileInView={{ opacity: 1, z: 0, rotateY: 0 }}
              transition={{ delay: i * 0.12, duration: 0.6, type: "spring", stiffness: 80 }}
              viewport={{ once: true, margin: "-30px" }}
              whileHover={{ z: 30, scale: 1.08, boxShadow: "0 15px 30px -10px rgba(0,0,0,0.3)" }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.div
                initial={{ scale: 0, rotateZ: -180 }}
                whileInView={{ scale: 1, rotateZ: 0 }}
                transition={{ delay: i * 0.12 + 0.2, duration: 0.5, type: "spring", stiffness: 150 }}
                viewport={{ once: true }}
              >
                <f.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-2 sm:mb-3" />
              </motion.div>
              <h3 className="font-display font-semibold text-sm sm:text-base mb-1">{f.title}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
