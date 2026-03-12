-- Ensure the same coupon can only be redeemed once per user,
-- while still allowing the same user to redeem different coupons.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'coupon_usages_coupon_id_user_id_key'
      AND conrelid = 'public.coupon_usages'::regclass
  ) THEN
    ALTER TABLE public.coupon_usages
      ADD CONSTRAINT coupon_usages_coupon_id_user_id_key UNIQUE (coupon_id, user_id);
  END IF;
END $$;