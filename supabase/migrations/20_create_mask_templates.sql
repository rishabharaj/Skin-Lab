-- Create mask_templates table for parametric phone mask generation
BEGIN;

CREATE TABLE IF NOT EXISTS public.mask_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  brand_hint TEXT,
  config JSONB NOT NULL,
  preview_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.mask_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view mask templates"
  ON public.mask_templates FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert mask templates"
  ON public.mask_templates FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role('admin', auth.uid()));

CREATE POLICY "Admins can update mask templates"
  ON public.mask_templates FOR UPDATE
  TO authenticated
  USING (public.has_role('admin', auth.uid()));

CREATE POLICY "Admins can delete mask templates"
  ON public.mask_templates FOR DELETE
  TO authenticated
  USING (public.has_role('admin', auth.uid()));

COMMIT;
