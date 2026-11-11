# Salem Estate: real estate website for Ghana

React + Vite front end, Supabase for login, database and image storage.

## 1. Run it locally
```bash
npm install
cp .env.example .env     # the file MUST be named .env (with the dot), then fill in your keys (step 2)
npm run dev
```
Without keys the site still runs with sample listings so you can preview the design.

## 2. Set up Supabase (free tier is enough to start)
1. Create a project at supabase.com.
2. SQL Editor: paste and run `supabase/schema.sql`. This creates the tables, the image bucket and all security policies.
3. Project Settings > API: copy the Project URL and the publishable (or anon) key into `.env` as `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. Restart `npm run dev` after any change to `.env`.
4. Authentication > Providers > Email: **turn off "Allow new users to sign up"** so nobody can register themselves.
5. Authentication > Users > Add user: create your admin account (email + strong password).
6. SQL Editor: make that user an admin:
   `insert into public.admins (user_id) select id from auth.users where email = 'you@yourcompany.com';`
7. Visit `/admin/login`.

## 3. Make it yours
- `src/config.js`: company name, **logo** (`logo: '/logo.svg'`, file in `/public`), phone, WhatsApp, address, cities and the **team** list (photos go in `/public/team`).
- `src/index.css`: brand colours are the variables at the top (`--forest`, `--gold`).
- `src/i18n/translations.js`: every sentence in English and Twi. The About page copy is placeholder text. Edit it to your real story. Have a native Twi speaker review the Twi before launch.

## 3b. Email alerts for new inquiries (optional)
1. Create a free account at resend.com, verify your sending domain, and create an API key.
2. Install the Supabase CLI, then from this folder:
   ```bash
   supabase login && supabase link --project-ref YOUR-PROJECT-REF
   supabase secrets set RESEND_API_KEY=... FROM_EMAIL="Salem Estate <alerts@yourdomain.com>" NOTIFY_EMAIL=office@yourdomain.com WEBHOOK_SECRET=make-up-a-long-random-string
   supabase functions deploy notify-inquiry --no-verify-jwt
   ```
3. Supabase > Database > Webhooks > Create: table `inquiries`, event Insert, type HTTP Request (POST) to your function URL, with header `x-webhook-secret` set to the same secret.

WhatsApp: automatic WhatsApp alerts need Meta's paid WhatsApp Business API, so the admin inbox instead has a **Reply on WhatsApp** button that opens a chat with the customer.

## 4. Deploy
Vercel or Netlify: build command `npm run build`, output `dist`, and add the two `VITE_` variables.
`vercel.json` and `public/_headers` already add the security headers and single-page-app routing.
Set your custom domain to HTTPS only.

## How security works
- Real protection is in the database (Row Level Security), not the browser. Only users in `public.admins` can create, edit or delete listings, upload or remove images, and read inquiries. The public can only read published listings and send an inquiry.
- Draft listings are invisible to the public.
- Image uploads: admin-only, JPG/PNG/WebP, 5 MB cap, random file names (enforced in the bucket too).
- Inquiry form has a honeypot and length limits in the database. For heavy spam, add Cloudflare Turnstile.
- Strict Content-Security-Policy, clickjacking protection and HSTS headers are included.
- The admin code is a separate bundle that public visitors never download.
- Use strong admin passwords and consider enabling MFA in Supabase.

## Good next steps
Server-side pagination once you pass a few hundred listings, an email notification on new inquiries (Supabase Database Webhook), and an About page.
