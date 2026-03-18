-- Add mask_template_id FK to device_models
BEGIN;

ALTER TABLE public.device_models
  ADD COLUMN IF NOT EXISTS mask_template_id UUID REFERENCES public.mask_templates(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_device_models_template_id ON public.device_models(mask_template_id);

COMMIT;
