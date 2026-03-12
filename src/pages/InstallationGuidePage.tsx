import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CheckCircle2, AlertTriangle, Smartphone, Droplets, Hand, Scissors, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Droplets,
    title: "Clean Your Device",
    description: "Use the included alcohol wipe to thoroughly clean the back of your phone. Remove all dust, fingerprints, and oils. Let it dry completely before applying the skin.",
    tip: "For best results, apply the skin in a dust-free environment.",
  },
  {
    icon: Scissors,
    title: "Peel the Skin",
    description: "Carefully peel the skin from the backing sheet. Hold it by the edges to avoid touching the adhesive side. Take your time — don't rush this step.",
    tip: "If the skin curls, gently flatten it before applying.",
  },
  {
    icon: Smartphone,
    title: "Align with Your Device",
    description: "Hold the skin above your phone and align the camera cutout and edges first. Start from the top and slowly lower it onto your device. Don't press down yet — just position it correctly.",
    tip: "Use the camera cutout as your primary alignment reference.",
  },
  {
    icon: Hand,
    title: "Apply & Smooth Out",
    description: "Once aligned, press firmly from the center outward using your fingers or a flat card. This pushes out air bubbles and ensures a tight bond. Work slowly toward the edges.",
    tip: "Use a credit card wrapped in a soft cloth for the smoothest finish.",
  },
  {
    icon: CheckCircle2,
    title: "Finish & Inspect",
    description: "Press all edges firmly, especially around corners and the camera cutout. Check for any air bubbles — if you find any, gently lift that area and reapply. Your skin is now installed!",
    tip: "Small bubbles may disappear on their own within 24-48 hours.",
  },
];

const dos = [
  "Clean your phone thoroughly before applying",
  "Apply in a dust-free environment",
  "Use a card to smooth out air bubbles",
  "Start alignment from the camera cutout",
  "Press edges firmly for a secure bond",
];

const donts = [
  "Don't rush the application process",
  "Don't touch the adhesive side with fingers",
  "Don't apply on a wet or dirty surface",
  "Don't stretch or pull the skin forcefully",
  "Don't use a hair dryer — heat can warp the skin",
];

const InstallationGuidePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Installation Guide
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Follow these simple steps to perfectly apply your SkinLab skin.
            </p>
          </motion.div>

          {/* Steps */}
          <div className="max-w-3xl mx-auto mb-20">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative flex gap-6 pb-12 last:pb-0"
              >
                {/* Vertical line */}
                {i < steps.length - 1 && (
                  <div className="absolute left-6 top-14 w-px h-[calc(100%-3.5rem)] bg-border/50" />
                )}

                {/* Step number + icon */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center relative">
                    <step.icon size={20} className="text-primary" />
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 rounded-xl bg-card border border-border/50 p-5">
                  <h3 className="font-display font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {step.description}
                  </p>
                  <div className="flex items-start gap-2 text-xs bg-primary/5 border border-primary/10 rounded-lg px-3 py-2">
                    <ArrowRight size={12} className="text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground"><strong className="text-foreground">Pro tip:</strong> {step.tip}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Do's and Don'ts */}
          <div className="max-w-3xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-display font-bold text-center mb-8"
            >
              Do's & Don'ts
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-xl bg-card border border-green-500/20 p-6"
              >
                <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-green-500" />
                  Do's
                </h3>
                <ul className="space-y-3">
                  {dos.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-xl bg-card border border-destructive/20 p-6"
              >
                <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
                  <AlertTriangle size={20} className="text-destructive" />
                  Don'ts
                </h3>
                <ul className="space-y-3">
                  {donts.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <AlertTriangle size={14} className="text-destructive mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-16"
          >
            <p className="text-muted-foreground mb-4">Need more help?</p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-display font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Contact Support
            </a>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default InstallationGuidePage;
