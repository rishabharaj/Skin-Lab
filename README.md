# Skin-Lab

Premium mobile skin storefront built with React, Vite, TypeScript, Supabase, and Tailwind CSS.

## Tech Stack

- React 18
- Vite 5
- TypeScript
- Tailwind CSS
- Supabase (Auth, Postgres, Storage, Edge Functions)
- TanStack Query

## Local Development

1. Install dependencies:

```sh
npm install
```

2. Configure environment variables:

```sh
cp .env.example .env
```

3. Start development server:

```sh
npm run dev
```

## Build

```sh
npm run build
```

## Test

```sh
npm run test
```

## Deployment

See `docs/DEPLOYMENT.md` for production checklist.

## Deploy on Vercel (GitHub)

1. Push this repository to GitHub.
2. In Vercel, click `Add New -> Project` and import the GitHub repo.
3. Build settings (auto-detected from `vercel.json`):
	- Build Command: `npm run build`
	- Output Directory: `dist`
4. Add the required environment variables listed below.
5. Deploy.

### Required Environment Variables (Vercel)

Add these in `Vercel -> Project Settings -> Environment Variables`:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

Optional:

- `VITE_RAZORPAY_KEY_ID` (only if/when Razorpay frontend flow is enabled)

### Important OAuth Setting

After first deploy, add your Vercel domain in Supabase Auth settings:

- `Supabase -> Authentication -> URL Configuration -> Redirect URLs`
- Add: `https://<your-project>.vercel.app/login`
- Also add your custom domain login URL if you use one.
