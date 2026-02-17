
-- Run this script in the Supabase SQL Editor to fix permission errors (42501)

-- 1. Reset Trigger to be safe
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- 2. Ensure Tables exist (Idempotent)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  name text,
  role text default 'BUYER', -- simplified type for robustness
  company_name text,
  inn text,
  phone text,
  website text,
  region text,
  balance numeric default 0,
  rating numeric default 0,
  is_verified boolean default false,
  is_blocked boolean default false,
  years_on_platform int default 1,
  avatar text,
  created_at timestamptz default now()
);

create table if not exists public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  parent_id uuid references public.categories(id),
  image text,
  created_at timestamptz default now()
);

create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  seller_id uuid references public.profiles(id) not null,
  category_id uuid references public.categories(id) not null,
  name text not null,
  description text,
  price numeric not null,
  stock numeric default 0,
  image text,
  specifications jsonb default '{}'::jsonb,
  tags text[],
  views int default 0,
  region text,
  gost text,
  status text default 'ACTIVE',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.leads (
  id uuid default gen_random_uuid() primary key,
  seller_id uuid references public.profiles(id) not null,
  buyer_name text,
  buyer_phone text,
  product_name text,
  amount numeric,
  total_price numeric,
  status text default 'NEW',
  date date default CURRENT_DATE,
  created_at timestamptz default now()
);

create table if not exists public.excel_import_logs (
  id uuid default gen_random_uuid() primary key,
  seller_id uuid references public.profiles(id) not null,
  file_name text,
  status text check (status in ('SUCCESS', 'FAILED', 'PROCESSING')),
  row_count int,
  created_at timestamptz default now()
);

-- 3. Enable RLS
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.leads enable row level security;

-- 4. FIX POLICIES (This fixes the 42501 error)
-- Allow Select
drop policy if exists "Users can see own profile" on public.profiles;
create policy "Users can see own profile" on public.profiles for select using (auth.uid() = id);

-- Allow Update
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- CRITICAL FIX: Allow Insert (Manual fallback creation)
drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Products Policies
drop policy if exists "Public products are viewable by everyone" on public.products;
create policy "Public products are viewable by everyone" on public.products for select using (status = 'ACTIVE');

drop policy if exists "Sellers can manage own products" on public.products;
create policy "Sellers can manage own products" on public.products for all using (auth.uid() = seller_id);

-- 5. Restore Trigger (Best effort auto-creation)
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, name, role, company_name)
  values (
    new.id, 
    new.email, 
    coalesce(new.raw_user_meta_data->>'name', 'Пользователь'), 
    coalesce(new.raw_user_meta_data->>'role', 'BUYER'),
    new.raw_user_meta_data->>'company_name'
  );
  return new;
exception
  when others then
    -- Log but don't fail, so the frontend fallback can handle it via the Insert policy above
    return new; 
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
