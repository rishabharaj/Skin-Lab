-- Collections for skins, managed from admin and consumed across storefront
CREATE TABLE IF NOT EXISTS public.skin_collections (
  id text PRIMARY KEY,
  name text NOT NULL UNIQUE,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.skin_collections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view skin collections" ON public.skin_collections;
DROP POLICY IF EXISTS "Admins can insert skin collections" ON public.skin_collections;
DROP POLICY IF EXISTS "Admins can update skin collections" ON public.skin_collections;
DROP POLICY IF EXISTS "Admins can delete skin collections" ON public.skin_collections;

CREATE POLICY "Anyone can view skin collections" ON public.skin_collections
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert skin collections" ON public.skin_collections
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update skin collections" ON public.skin_collections
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete skin collections" ON public.skin_collections
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.skin_collections (id, name, description, sort_order)
VALUES
  ('anime', 'Anime', 'Japanese anime and manga inspired designs', 1),
  ('3d', '3D Abstract', 'Futuristic 3D renders and holographic art', 2),
  ('marble', 'Marble', 'Luxury marble with gold veins', 3),
  ('galaxy', 'Galaxy & Space', 'Cosmic nebula and aurora designs', 4),
  ('geometric', 'Geometric', 'Bold patterns and art deco lines', 5),
  ('floral', 'Floral', 'Botanical prints and flower patterns', 6),
  ('glitch', 'Glitch Art', 'Digital glitch and vaporwave aesthetic', 7),
  ('carbon', 'Carbon Fiber', 'Premium carbon fiber texture', 8),
  ('leather', 'Leather', 'Genuine leather feel', 9),
  ('wood', 'Wood', 'Natural wood grain patterns', 10),
  ('metal', 'Brushed Metal', 'Industrial metal finish', 11),
  ('matte', 'Matte Colors', 'Smooth matte finish', 12),
  ('camo', 'Camo', 'Military-grade patterns', 13)
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name,
    description = EXCLUDED.description,
    sort_order = EXCLUDED.sort_order;