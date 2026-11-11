-- Run this once in Supabase > SQL Editor.

-- 1. Admins: only users listed here can manage listings.
create table public.admins (user_id uuid primary key references auth.users(id) on delete cascade);
alter table public.admins enable row level security;
create policy "Admins can read own row" on public.admins for select to authenticated using (user_id = auth.uid());

create or replace function public.is_admin() returns boolean
language sql security definer stable set search_path = public
as $$ select exists (select 1 from public.admins where user_id = auth.uid()) $$;

-- 2. Listings
create table public.listings (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 3 and 140),
  description text check (char_length(description) <= 5000),
  price numeric(14,2) not null check (price >= 0),
  currency text not null default 'GHS' check (currency in ('GHS','USD')),
  listing_type text not null default 'sale' check (listing_type in ('sale','rent')),
  property_type text not null default 'house' check (property_type in ('house','apartment','townhouse','land','commercial')),
  bedrooms int check (bedrooms >= 0),
  bathrooms int check (bathrooms >= 0),
  area_sqm int check (area_sqm >= 0),
  location text not null,
  city text not null,
  features text[] not null default '{}',
  images text[] not null default '{}',
  status text not null default 'published' check (status in ('draft','published','sold')),
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.listings enable row level security;
create policy "Public reads published listings" on public.listings for select using (status <> 'draft' or public.is_admin());
create policy "Admins insert listings" on public.listings for insert to authenticated with check (public.is_admin());
create policy "Admins update listings" on public.listings for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins delete listings" on public.listings for delete to authenticated using (public.is_admin());

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
create trigger listings_touch before update on public.listings for each row execute function public.touch_updated_at();

-- 3. Inquiries: anyone can send one, only admins can read them.
create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings(id) on delete set null,
  name text not null check (char_length(name) between 2 and 100),
  phone text check (char_length(phone) <= 30),
  email text check (char_length(email) <= 120),
  message text not null check (char_length(message) between 5 and 2000),
  created_at timestamptz not null default now()
);
alter table public.inquiries enable row level security;
create policy "Anyone can send an inquiry" on public.inquiries for insert to anon, authenticated with check (true);
create policy "Admins read inquiries" on public.inquiries for select to authenticated using (public.is_admin());
create policy "Admins delete inquiries" on public.inquiries for delete to authenticated using (public.is_admin());

-- 4. Image storage (public read, admin-only write, 5 MB, images only)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('listing-images','listing-images', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;
create policy "Public reads listing images" on storage.objects for select using (bucket_id = 'listing-images');
create policy "Admins upload listing images" on storage.objects for insert to authenticated with check (bucket_id = 'listing-images' and public.is_admin());
create policy "Admins update listing images" on storage.objects for update to authenticated using (bucket_id = 'listing-images' and public.is_admin());
create policy "Admins delete listing images" on storage.objects for delete to authenticated using (bucket_id = 'listing-images' and public.is_admin());

-- 5. After creating your admin user in Authentication > Users, run:
-- insert into public.admins (user_id) select id from auth.users where email = 'you@yourcompany.com';
