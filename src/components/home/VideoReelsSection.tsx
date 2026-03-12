import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useVideoReels } from "@/hooks/useVideoReels";

const VideoReelsSection = () => {
  const { data: reels = [], isLoading } = useVideoReels(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const scrollToIndex = useCallback((index: number) => {
    const container = scrollRef.current;
    if (!container || !container.children[0]) return;
    const cardWidth = (container.children[0] as HTMLElement).clientWidth;
    const gap = 16;
    container.scrollTo({ left: index * (cardWidth + gap), behavior: "smooth" });
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const handleScroll = () => {
      const child = container.children[0] as HTMLElement | undefined;
      const cardWidth = child?.clientWidth || 1;
      const gap = 16;
      const idx = Math.round(container.scrollLeft / (cardWidth + gap));
      setActiveIndex(Math.max(0, Math.min(idx, reels.length - 1)));
    };
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [reels.length]);

  useEffect(() => {
    videoRefs.current.forEach((vid, i) => {
      if (!vid) return;
      if (i === activeIndex && isPlaying) {
        vid.play().catch(() => {});
      } else {
        vid.pause();
      }
      vid.muted = isMuted;
    });
  }, [activeIndex, isPlaying, isMuted]);

  const handleVideoEnd = useCallback((index: number) => {
    if (reels.length === 0) return;
    scrollToIndex(index < reels.length - 1 ? index + 1 : 0);
  }, [scrollToIndex, reels.length]);

  const goNext = () => scrollToIndex(activeIndex < reels.length - 1 ? activeIndex + 1 : 0);
  const goPrev = () => scrollToIndex(activeIndex > 0 ? activeIndex - 1 : reels.length - 1);

  if (isLoading) return null;
  if (reels.length === 0) return null;

  return (
    <section className="py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-2">
            Happy Customers ❤️
          </h2>
          <p className="text-muted-foreground">
            Real reviews from our customers — see what they're saying about SkinLab
          </p>
        </motion.div>

        <div className="relative">
          <button
            onClick={goPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-card/80 backdrop-blur border border-border/50 flex items-center justify-center text-foreground hover:bg-card transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={goNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-card/80 backdrop-blur border border-border/50 flex items-center justify-center text-foreground hover:bg-card transition-colors"
          >
            <ChevronRight size={20} />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {reels.map((reel, i) => (
              <div key={reel.id} className="flex-shrink-0 w-[280px] md:w-[320px] snap-center">
                <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-secondary border border-border/30 group">
                  <video
                    ref={(el) => { videoRefs.current[i] = el; }}
                    src={reel.video_url}
                    className="w-full h-full object-cover"
                    loop={false}
                    muted={isMuted}
                    playsInline
                    preload="metadata"
                    poster={reel.thumbnail_url || undefined}
                    onEnded={() => handleVideoEnd(i)}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/90 to-transparent">
                    <p className="text-sm font-display font-semibold">{reel.title}</p>
                    {reel.description && (
                      <p className="text-xs text-muted-foreground">{reel.description}</p>
                    )}
                  </div>
                  {activeIndex === i && (
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-primary/90 text-primary-foreground text-[10px] font-bold">
                      NOW PLAYING
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-9 h-9 rounded-full bg-card border border-border/50 flex items-center justify-center text-foreground hover:bg-surface-hover transition-colors"
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <div className="flex items-center gap-2">
              {reels.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeIndex === i ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="w-9 h-9 rounded-full bg-card border border-border/50 flex items-center justify-center text-foreground hover:bg-surface-hover transition-colors"
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoReelsSection;
