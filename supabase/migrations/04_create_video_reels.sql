
-- Create video_reels table
CREATE TABLE public.video_reels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  video_url text NOT NULL,
  thumbnail_url text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.video_reels ENABLE ROW LEVEL SECURITY;

-- Public read for active reels
CREATE POLICY "Anyone can view active reels"
ON public.video_reels FOR SELECT
USING (is_active = true);

-- Authenticated CRUD
CREATE POLICY "Authenticated can insert reels"
ON public.video_reels FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated can update reels"
ON public.video_reels FOR UPDATE TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated can delete reels"
ON public.video_reels FOR DELETE TO authenticated
USING (true);

-- Storage bucket for reel videos
INSERT INTO storage.buckets (id, name, public)
VALUES ('video-reels', 'video-reels', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read for video reels"
ON storage.objects FOR SELECT
USING (bucket_id = 'video-reels');

CREATE POLICY "Authenticated upload video reels"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'video-reels');

CREATE POLICY "Authenticated delete video reels"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'video-reels');
