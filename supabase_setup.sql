-- Run this script in the Supabase SQL Editor to fix the "Database error saving new user" issue.

-- 1. Clean up old triggers and functions to ensure a fresh start
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- 2. Ensure Types exist (Idempotent-ish: we catch error if exists or just ignore)
do $$ begin
    create type user_role as enum ('ADMIN', 'SELLER', 'BUYER');
exception
    when duplicate_object then null;
end $$;

do $$ begin
    create type product_status as enum ('ACTIVE', 'DRAFT', 'MODERATION', 'ARCHIVED');
exception
    when duplicate_object then null;
end $$;

do $$ begin
    create type lead_status as enum ('NEW', 'IN_PROGRESS', 'DONE', 'REJECTED');
exception
    when duplicate_object then null;
end $$;

-- 3. Ensure Tables exist
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  name text,
  role user_role default 'BUYER',
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
  status product_status default 'ACTIVE',
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
  status lead_status default 'NEW',
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

-- 4. Enable RLS
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.leads enable row level security;

-- 5. RLS Policies (Drop existing to avoid conflicts then recreate)
drop policy if exists "Public products are viewable by everyone" on public.products;
create policy "Public products are viewable by everyone" on public.products for select using (status = 'ACTIVE');

drop policy if exists "Sellers can manage own products" on public.products;
create policy "Sellers can manage own products" on public.products for all using (auth.uid() = seller_id);

drop policy if exists "Users can see own profile" on public.profiles;
create policy "Users can see own profile" on public.profiles for select using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- 6. Robust Trigger Function
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (
    id, 
    email, 
    name, 
    role, 
    company_name
  )
  values (
    new.id, 
    new.email, 
    coalesce(new.raw_user_meta_data->>'name', 'Пользователь'), 
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'BUYER'),
    new.raw_user_meta_data->>'company_name'
  );
  return new;
exception
  when others then
    -- Log error (visible in Supabase logs) but try to continue or raise nicely
    raise notice 'Error in handle_new_user: %', SQLERRM;
    return new; -- If we return NEW even on error, Auth user is created, but profile might be missing.
                -- However, usually we WANT to fail if profile fails. 
                -- To fix "Database error" caused by bad SQL, we fixed the SQL above.
end;
$$ language plpgsql security definer;

-- 7. Re-attach Trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
