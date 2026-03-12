import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    category: "Orders & Shipping",
    questions: [
      {
        q: "How long does delivery take?",
        a: "We ship all orders within 1-2 business days. Standard delivery takes 3-5 business days, and express delivery takes 1-2 business days depending on your location.",
      },
      {
        q: "Do you ship internationally?",
        a: "Currently we ship across India. International shipping will be available soon. Stay tuned for updates!",
      },
      {
        q: "How can I track my order?",
        a: "Once your order is shipped, you'll receive a tracking link via email and WhatsApp. You can use that link to track your order in real-time.",
      },
    ],
  },
  {
    category: "Skins & Application",
    questions: [
      {
        q: "How do I apply the skin on my phone?",
        a: "Each skin comes with easy-to-follow instructions. Clean your phone surface, align the skin carefully, and press firmly from center outward. You can also watch our installation videos for step-by-step guidance.",
      },
      {
        q: "Will the skin damage my phone?",
        a: "Absolutely not. Our skins use residue-free adhesive that peels off cleanly without leaving any marks or damaging your phone's surface.",
      },
      {
        q: "Can I reuse a skin after removing it?",
        a: "Skins are designed for one-time use. Once removed, the adhesive may not stick properly again. We recommend purchasing a new skin if you want to reapply.",
      },
      {
        q: "Are the skins waterproof?",
        a: "Our skins are water-resistant and can handle light splashes, but they are not fully waterproof. Avoid submerging your device in water.",
      },
      {
        q: "What material are the skins made of?",
        a: "We use premium 3M vinyl with high-quality printing. The skins are thin, durable, and provide excellent grip and scratch protection.",
      },
    ],
  },
  {
    category: "Payment & Pricing",
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept UPI, credit/debit cards, net banking, and popular wallets like Paytm and PhonePe. Cash on Delivery (COD) is also available.",
      },
      {
        q: "Is COD available?",
        a: "Yes, Cash on Delivery is available for orders across India. A small COD fee may apply depending on your location.",
      },
      {
        q: "Do you offer discounts or coupons?",
        a: "Yes! Follow us on social media and subscribe to our newsletter to get exclusive discount codes and early access to sales.",
      },
    ],
  },
  {
    category: "General",
    questions: [
      {
        q: "My phone model is not listed. Can I still order?",
        a: "We're constantly adding new models. Contact us on WhatsApp with your phone model and we'll let you know if we can make a custom skin for you.",
      },
      {
        q: "How do I contact customer support?",
        a: "You can reach us via WhatsApp at +91 86021 65151 or email us at yourtestman2024@gmail.com. We typically respond within 24 hours.",
      },
      {
        q: "Can I get a custom design skin?",
        a: "Yes! We offer custom design services. Send us your artwork or idea via WhatsApp and we'll create a unique skin just for you. Custom orders may take additional processing time.",
      },
    ],
  },
];

const FAQPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Find answers to common questions about our skins, orders, and more.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-10">
            {faqs.map((section, si) => (
              <motion.div
                key={section.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: si * 0.1 }}
              >
                <h2 className="text-xl font-display font-bold mb-4">
                  {section.category}
                </h2>
                <Accordion type="single" collapsible className="rounded-xl border border-border/50 bg-card overflow-hidden">
                  {section.questions.map((faq, qi) => (
                    <AccordionItem
                      key={qi}
                      value={`${si}-${qi}`}
                      className="border-border/30"
                    >
                      <AccordionTrigger className="px-5 py-4 text-sm font-medium hover:no-underline hover:bg-surface-hover/50">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-16"
          >
            <p className="text-muted-foreground mb-4">
              Still have questions?
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-display font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Contact Us
            </a>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQPage;
