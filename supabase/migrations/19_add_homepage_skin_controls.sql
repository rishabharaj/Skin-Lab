-- Controls for homepage auto-scrolling featured skins
ALTER TABLE public.skins
  ADD COLUMN IF NOT EXISTS show_on_homepage boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS homepage_sort_order integer NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_skins_show_on_homepage
  ON public.skins(show_on_homepage, homepage_sort_order);