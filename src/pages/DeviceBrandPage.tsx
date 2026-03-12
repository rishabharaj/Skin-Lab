import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useDeviceBrand, useDeviceModels } from "@/hooks/useDevices";
import { ChevronRight, Search } from "lucide-react";

const DeviceBrandPage = () => {
  const { category, brandId } = useParams<{ category: string; brandId: string }>();
  const [search, setSearch] = useState("");
  const { data: brand, isLoading: brandLoading } = useDeviceBrand(brandId);
  const { data: models = [], isLoading: modelsLoading } = useDeviceModels(brandId);

  const filteredModels = models.filter((model) =>
    model.name.toLowerCase().includes(search.toLowerCase())
  );

  if (brandLoading) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="h-8 bg-secondary rounded w-48 mb-8 animate-pulse" />
          <div className="h-12 bg-secondary rounded w-64 mb-12 animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="p-6 rounded-xl bg-card border border-border/50 animate-pulse">
                <div className="aspect-square bg-secondary rounded-lg mb-4" />
                <div className="h-5 bg-secondary rounded w-3/4 mb-2" />
                <div className="h-4 bg-secondary rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );

  if (!brand) return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Brand not found</div>;

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
            <span className="text-foreground">{brand.name}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">{brand.name}</h1>
              <p className="text-muted-foreground">Select your model</p>
            </div>
            <div className="relative w-full md:w-80">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search models..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-secondary border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {filteredModels.length === 0 ? (
            <div className="text-center py-16">
              <span className="text-5xl mb-4 block">🔍</span>
              <h3 className="text-xl font-display font-semibold mb-2">No models found</h3>
              <p className="text-muted-foreground">Try a different search term</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredModels.map((model, i) => (
                <motion.div
                  key={model.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    to={`/devices/${category}/${brandId}/${model.slug}`}
                    className="group block p-6 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:bg-surface-hover transition-all duration-300"
                  >
                    <div className="aspect-square bg-secondary/50 rounded-lg mb-4 flex items-center justify-center">
                      <span className="text-5xl">📱</span>
                    </div>
                    <h3 className="font-display font-semibold">{model.name}</h3>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DeviceBrandPage;
