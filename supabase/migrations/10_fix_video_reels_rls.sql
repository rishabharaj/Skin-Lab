-- Drop overly permissive policies on video_reels and replace with admin-only policies
DROP POLICY IF EXISTS "Authenticated can delete reels" ON public.video_reels;
DROP POLICY IF EXISTS "Authenticated can insert reels" ON public.video_reels;
DROP POLICY IF EXISTS "Authenticated can update reels" ON public.video_reels;

CREATE POLICY "Admins can insert reels" ON public.video_reels FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update reels" ON public.video_reels FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete reels" ON public.video_reels FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Drop overly permissive policy on device_models and replace with admin-only
DROP POLICY IF EXISTS "Authenticated users can update models" ON public.device_models;
CREATE POLICY "Admins can update devices" ON public.device_models FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));