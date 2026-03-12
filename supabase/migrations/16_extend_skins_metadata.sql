-- Extend skins table to persist admin form metadata
ALTER TABLE public.skins
  ADD COLUMN IF NOT EXISTS original_price numeric,
  ADD COLUMN IF NOT EXISTS badge text,
  ADD COLUMN IF NOT EXISTS offer_tag text;

-- Keep badge values predictable for UI filters/badges
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'skins_badge_check'
      AND conrelid = 'public.skins'::regclass
  ) THEN
    ALTER TABLE public.skins
      ADD CONSTRAINT skins_badge_check
      CHECK (badge IS NULL OR badge IN ('trending', 'bestseller', 'new'));
  END IF;
END $$;