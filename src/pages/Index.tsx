import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import CategorySection from "@/components/home/CategorySection";
import TrendingSection from "@/components/home/TrendingSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import VideoReelsSection from "@/components/home/VideoReelsSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        <CategorySection />
        <TrendingSection />
        <VideoReelsSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
