-- Create table for device brands
CREATE TABLE public.device_brands (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for device models
CREATE TABLE public.device_models (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  brand_id UUID NOT NULL REFERENCES public.device_brands(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  image_url TEXT,
  mockup_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.device_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_models ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can view brands" ON public.device_brands FOR SELECT USING (true);
CREATE POLICY "Anyone can view models" ON public.device_models FOR SELECT USING (true);

-- Indexes
CREATE INDEX idx_device_models_brand_id ON public.device_models(brand_id);