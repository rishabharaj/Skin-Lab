# Skin-Lab Production Deployment Guide

## Current Infrastructure

This project runs on a **managed cloud setup**, which provides:
- Production-ready PostgreSQL database
- Managed authentication (Google OAuth)
- Storage buckets for images/videos
- Edge functions support
- Automatic SSL/TLS

## Database Schema

Full schema export: `docs/database-schema.sql`

### Tables
| Table | Purpose |
|-------|---------|
| `profiles` | User profiles (auto-created on signup) |
| `orders` | Customer orders |
| `order_items` | Line items per order |
| `device_brands` | Phone manufacturers |
| `device_models` | Individual phone models |
| `video_reels` | Promotional videos |

### Indexes (Performance Optimized)
- `idx_device_models_brand_id` - Fast brand filtering
- `idx_orders_user_id` - Fast user order lookup
- `idx_order_items_order_id` - Fast order item retrieval
- `idx_orders_created_at` - Sorted order history

## Storage Buckets

| Bucket | Access | Purpose |
|--------|--------|---------|
| `phone-masks` | Public | Device cutout masks |
| `skin-images` | Public | Skin texture images |
| `video-reels` | Public | Video content |

## Authentication

- Provider: Google OAuth (managed in your authentication provider settings)
- Trigger: `handle_new_user` auto-creates profile on signup
- Session: Persisted in localStorage, auto-refresh enabled

## Environment Variables

For external deployment (Vercel/Netlify):

```env
VITE_SUPABASE_URL=https://svbohqbdfftixihdyjrm.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your_anon_key>
VITE_SUPABASE_PROJECT_ID=svbohqbdfftixihdyjrm
```

## Deployment Options

### Option 1: Managed Host (Recommended)
1. Deploy through your managed hosting platform
2. Configure custom domain in hosting settings
3. Done - fully managed

### Option 2: Vercel
1. Connect GitHub repo
2. Add environment variables above
3. Deploy

### Option 3: External Supabase
1. Create new Supabase project
2. From VS Code project root run `npx supabase login`
3. Run `npx supabase link --project-ref svbohqbdfftixihdyjrm`
4. Run `npx supabase db push` to apply all migrations in `supabase/migrations`
5. Run data seed migration `supabase/migrations/20260312051000_seed_brands_and_models_from_csv.sql`
6. Create storage buckets (phone-masks, skin-images, video-reels)
7. Enable Google OAuth in Authentication settings
8. Update environment variables

## Verification Checklist

- [ ] Google login works → profile created
- [ ] Device brands load on homepage
- [ ] Device models load per brand
- [ ] Images load from storage buckets
- [ ] Cart → Checkout → Order created
- [ ] Order items linked correctly
- [ ] Orders page shows user's orders

## RLS Security

All tables have Row-Level Security enabled:
- Users can only see/modify their own data
- Public tables (brands, models, reels) readable by all
- Orders/profiles restricted to authenticated owner
