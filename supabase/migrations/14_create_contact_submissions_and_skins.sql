-- Contact submissions table
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS policies for contact_submissions
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can submit (public form)
CREATE POLICY "Anyone can submit contact form" ON public.contact_submissions
  FOR INSERT WITH CHECK (true);

-- Only admins can view submissions
CREATE POLICY "Admins can view all submissions" ON public.contact_submissions
  FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- Admins can update status
CREATE POLICY "Admins can update submissions" ON public.contact_submissions
  FOR UPDATE USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Skins table for dynamic management
CREATE TABLE public.skins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'materials',
  color TEXT,
  texture_image TEXT,
  price NUMERIC NOT NULL DEFAULT 199,
  is_new BOOLEAN NOT NULL DEFAULT false,
  is_trending BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS for skins
ALTER TABLE public.skins ENABLE ROW LEVEL SECURITY;

-- Anyone can view active skins
CREATE POLICY "Anyone can view active skins" ON public.skins
  FOR SELECT USING (is_active = true);

-- Admins full access
CREATE POLICY "Admins can view all skins" ON public.skins
  FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert skins" ON public.skins
  FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update skins" ON public.skins
  FOR UPDATE USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete skins" ON public.skins
  FOR DELETE USING (has_role(auth.uid(), 'admin'));