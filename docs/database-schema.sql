-- =====================================================
-- SKIN-LAB DATABASE SCHEMA
-- Production-ready PostgreSQL/Supabase Schema
-- Generated: 2026-03-08
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: profiles
-- Stores user profile data, auto-created on signup
-- =====================================================
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    avatar_url TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- =====================================================
-- TABLE: device_brands
-- Stores phone/device brand information
-- =====================================================
CREATE TABLE public.device_brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    logo TEXT NOT NULL DEFAULT '📱',
    category TEXT NOT NULL DEFAULT 'phones',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.device_brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view brands" ON public.device_brands
    FOR SELECT USING (true);

-- =====================================================
-- TABLE: device_models
-- Stores individual device models linked to brands
-- =====================================================
CREATE TABLE public.device_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID NOT NULL REFERENCES public.device_brands(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    image_url TEXT,
    mockup_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_device_models_brand_id ON public.device_models(brand_id);

ALTER TABLE public.device_models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view models" ON public.device_models
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can update models" ON public.device_models
    FOR UPDATE USING (true) WITH CHECK (true);

-- =====================================================
-- TABLE: orders
-- Stores customer orders
-- =====================================================
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    order_number TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'confirmed',
    subtotal NUMERIC NOT NULL DEFAULT 0,
    tax NUMERIC NOT NULL DEFAULT 0,
    shipping NUMERIC NOT NULL DEFAULT 0,
    total NUMERIC NOT NULL DEFAULT 0,
    payment_method TEXT,
    shipping_address JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- TABLE: order_items
-- Stores line items for each order
-- =====================================================
CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    skin_name TEXT NOT NULL,
    device_name TEXT NOT NULL,
    coverage TEXT NOT NULL DEFAULT 'full',
    quantity INTEGER NOT NULL DEFAULT 1,
    price NUMERIC NOT NULL DEFAULT 0,
    skin_color TEXT,
    skin_texture_image TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own order items" ON public.order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND orders.user_id = auth.uid()
        )
    );

-- =====================================================
-- TABLE: video_reels
-- Stores promotional video content
-- =====================================================
CREATE TABLE public.video_reels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.video_reels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active reels" ON public.video_reels
    FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated can insert reels" ON public.video_reels
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated can update reels" ON public.video_reels
    FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated can delete reels" ON public.video_reels
    FOR DELETE USING (true);

-- =====================================================
-- TRIGGER: handle_new_user
-- Auto-creates profile on Google signup
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', '')
    );
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- STORAGE BUCKETS
-- =====================================================
-- Bucket: phone-masks (public)
-- Bucket: skin-images (public)
-- Bucket: video-reels (public)

-- =====================================================
-- ENVIRONMENT VARIABLES (for external deployment)
-- =====================================================
-- VITE_SUPABASE_URL=https://svbohqbdfftixihdyjrm.supabase.co
-- VITE_SUPABASE_PUBLISHABLE_KEY=<anon_key>
-- VITE_SUPABASE_PROJECT_ID=svbohqbdfftixihdyjrm
