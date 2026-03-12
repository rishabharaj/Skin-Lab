
-- Fix ALL RLS policies: Drop RESTRICTIVE and recreate as PERMISSIVE

-- ============ user_roles ============
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- ============ coupons ============
DROP POLICY IF EXISTS "Anyone can view active coupons" ON public.coupons;
DROP POLICY IF EXISTS "Admins can insert coupons" ON public.coupons;
DROP POLICY IF EXISTS "Admins can update coupons" ON public.coupons;
DROP POLICY IF EXISTS "Admins can delete coupons" ON public.coupons;

CREATE POLICY "Anyone can view active coupons" ON public.coupons FOR SELECT USING (true);
CREATE POLICY "Admins can insert coupons" ON public.coupons FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update coupons" ON public.coupons FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete coupons" ON public.coupons FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============ device_brands ============
DROP POLICY IF EXISTS "Anyone can view brands" ON public.device_brands;
DROP POLICY IF EXISTS "Admins can insert brands" ON public.device_brands;
DROP POLICY IF EXISTS "Admins can update brands" ON public.device_brands;
DROP POLICY IF EXISTS "Admins can delete brands" ON public.device_brands;

CREATE POLICY "Anyone can view brands" ON public.device_brands FOR SELECT USING (true);
CREATE POLICY "Admins can insert brands" ON public.device_brands FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update brands" ON public.device_brands FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete brands" ON public.device_brands FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============ device_models ============
DROP POLICY IF EXISTS "Anyone can view models" ON public.device_models;
DROP POLICY IF EXISTS "Admins can insert devices" ON public.device_models;
DROP POLICY IF EXISTS "Admins can update devices" ON public.device_models;
DROP POLICY IF EXISTS "Admins can delete devices" ON public.device_models;

CREATE POLICY "Anyone can view models" ON public.device_models FOR SELECT USING (true);
CREATE POLICY "Admins can insert devices" ON public.device_models FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update devices" ON public.device_models FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete devices" ON public.device_models FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============ orders ============
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;

CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can insert own orders" ON public.orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ order_items ============
DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can insert own order items" ON public.order_items;

CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));
CREATE POLICY "Admins can view all order items" ON public.order_items FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can insert own order items" ON public.order_items FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

-- ============ profiles ============
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ============ video_reels ============
DROP POLICY IF EXISTS "Anyone can view active reels" ON public.video_reels;
DROP POLICY IF EXISTS "Admins can insert reels" ON public.video_reels;
DROP POLICY IF EXISTS "Admins can update reels" ON public.video_reels;
DROP POLICY IF EXISTS "Admins can delete reels" ON public.video_reels;

CREATE POLICY "Anyone can view active reels" ON public.video_reels FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can view all reels" ON public.video_reels FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert reels" ON public.video_reels FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update reels" ON public.video_reels FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete reels" ON public.video_reels FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ============ coupon_usages ============
DROP POLICY IF EXISTS "Users can view own coupon usages" ON public.coupon_usages;
DROP POLICY IF EXISTS "Users can insert own coupon usages" ON public.coupon_usages;

CREATE POLICY "Users can view own coupon usages" ON public.coupon_usages FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own coupon usages" ON public.coupon_usages FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
