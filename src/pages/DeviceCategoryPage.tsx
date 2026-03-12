import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useDeviceBrands, useDeviceModels } from "@/hooks/useDevices";
import { brandPhoneImages } from "@/data/brandImages";
import { ChevronRight, Search } from "lucide-react";

const DeviceCategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [search, setSearch] = useState("");
  const { data: brands = [], isLoading } = useDeviceBrands();
  const { data: allModels = [] } = useDeviceModels();

  const filteredBrands = brands.filter((brand) => {
    if (!search) return true;
    const q = search.toLowerCase();
    // Match brand name
    if (brand.name.toLowerCase().includes(q)) return true;
    // Match any model under this brand
    const brandModels = Array.isArray(allModels)
      ? allModels.filter((m: any) => m.brand_id === brand.id)
      : [];
    return brandModels.some((m: any) => m.name.toLowerCase().includes(q));
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="capitalize text-foreground">{category}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-2 capitalize">{category}</h1>
              <p className="text-muted-foreground">Choose your brand to find the perfect skin</p>
            </div>
            <div className="relative w-full md:w-80">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search brands or models..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-secondary border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="p-6 rounded-xl bg-card border border-border/50 animate-pulse">
                  <div className="aspect-square bg-secondary rounded-lg mb-4" />
                  <div className="h-5 bg-secondary rounded w-2/3 mx-auto mb-2" />
                  <div className="h-4 bg-secondary rounded w-1/2 mx-auto" />
                </div>
              ))}
            </div>
          ) : filteredBrands.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-lg">No brands or models found for "{search}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredBrands.map((brand, i) => {
                const modelCount = Array.isArray(allModels)
                  ? allModels.filter((m: any) => m.brand_id === brand.id).length
                  : 0;
                const brandImage = brandPhoneImages[brand.slug];
                return (
                  <motion.div
                    key={brand.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Link
                      to={`/devices/${category}/${brand.slug}`}
                      className="group block rounded-xl bg-card border border-border/50 hover:border-primary/30 hover:bg-surface-hover transition-all duration-300 overflow-hidden"
                    >
                      <div className="aspect-square bg-secondary/30 flex items-center justify-center p-4 overflow-hidden">
                        {brandImage ? (
                          <img
                            src={brandImage.image}
                            alt={`${brand.name} latest phone`}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        ) : (
                          <span className="text-5xl">📱</span>
                        )}
                      </div>
                      <div className="p-4 border-t border-border/30">
                        <h3 className="font-display font-semibold text-lg">{brand.name}</h3>
                        {brandImage && (
                          <p className="text-xs text-primary/80 mt-0.5">{brandImage.latestModel}</p>
                        )}
                        <p className="text-sm text-muted-foreground mt-1">{modelCount} models</p>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DeviceCategoryPage;
