
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS payment_id text DEFAULT null,
  ADD COLUMN IF NOT EXISTS payment_order_id text DEFAULT null,
  ADD COLUMN IF NOT EXISTS payment_signature text DEFAULT null,
  ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending';
