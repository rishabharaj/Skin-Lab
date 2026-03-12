-- Add column to profiles to track if user has ever used a coupon
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS has_used_coupon boolean NOT NULL DEFAULT false;

-- Add RLS policy for admins to manage coupons
CREATE POLICY "Admins can insert coupons" ON public.coupons FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update coupons" ON public.coupons FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete coupons" ON public.coupons FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Add RLS policy for admins to manage devices
CREATE POLICY "Admins can insert devices" ON public.device_models FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete devices" ON public.device_models FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert brands" ON public.device_brands FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update brands" ON public.device_brands FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete brands" ON public.device_brands FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));