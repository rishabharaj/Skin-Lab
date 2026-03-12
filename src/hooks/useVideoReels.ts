import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface VideoReel {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export const useVideoReels = (activeOnly = true) =>
  useQuery({
    queryKey: ["video-reels", activeOnly],
    queryFn: async () => {
      let q = supabase
        .from("video_reels")
        .select("*")
        .order("sort_order", { ascending: true });
      if (activeOnly) q = q.eq("is_active", true);
      const { data, error } = await q;
      if (error) throw error;
      return data as VideoReel[];
    },
  });
