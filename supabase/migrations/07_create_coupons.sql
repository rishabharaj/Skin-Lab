
-- Create coupons table
CREATE TABLE public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    discount_percent NUMERIC NOT NULL DEFAULT 10,
    max_uses INTEGER NOT NULL DEFAULT 3,
    times_used INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active coupons" ON public.coupons
    FOR SELECT USING (true);

-- Create coupon_usages table
CREATE TABLE public.coupon_usages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(coupon_id, user_id)
);

CREATE INDEX idx_coupon_usages_coupon_id ON public.coupon_usages(coupon_id);
CREATE INDEX idx_coupon_usages_user_id ON public.coupon_usages(user_id);

ALTER TABLE public.coupon_usages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own coupon usages" ON public.coupon_usages
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own coupon usages" ON public.coupon_usages
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Add discount column to orders
ALTER TABLE public.orders ADD COLUMN discount NUMERIC NOT NULL DEFAULT 0;

-- Trigger to increment times_used on coupon
CREATE OR REPLACE FUNCTION public.increment_coupon_usage()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    UPDATE public.coupons SET times_used = times_used + 1 WHERE id = NEW.coupon_id;
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_coupon_usage_insert
    AFTER INSERT ON public.coupon_usages
    FOR EACH ROW
    EXECUTE FUNCTION public.increment_coupon_usage();
