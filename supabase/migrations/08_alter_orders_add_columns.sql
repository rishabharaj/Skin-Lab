
-- 1. Add columns to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_estimate text NOT NULL DEFAULT '2-4 days';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS status_updated_at timestamptz DEFAULT now();

-- 2. Create app_role enum and user_roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Create security definer function for role check
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 4. RLS on user_roles: users can view own roles
CREATE POLICY "Users can view own roles" ON public.user_roles
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- 5. Admin SELECT all orders
CREATE POLICY "Admins can view all orders" ON public.orders
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 6. Admin UPDATE orders (status + delivery_estimate)
CREATE POLICY "Admins can update orders" ON public.orders
FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 7. Admin SELECT all order_items
CREATE POLICY "Admins can view all order items" ON public.order_items
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 8. Admin SELECT all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
