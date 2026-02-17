
-- MASTER FIX SCRIPT & ADMIN UPDATE
-- 1. Drop tables that might cause conflicts (Data reset!)
drop table if exists public.excel_import_logs cascade;
drop table if exists public.leads cascade;
drop table if exists public.products cascade;
drop table if exists public.categories cascade;
drop table if exists public.admin_logs cascade;
drop table if exists public.tags cascade;

-- Note: We do NOT drop 'profiles' completely to keep users, but we will alter it.

-- 2. Update Profiles for Verification
alter table public.profiles add column if not exists verification_status text default 'NEW' check (verification_status in ('NEW', 'PENDING', 'VERIFIED', 'REJECTED', 'BLOCKED'));
alter table public.profiles add column if not exists ogrn text;
alter table public.profiles add column if not exists documents jsonb default '[]'::jsonb;
alter table public.profiles add column if not exists created_at timestamptz default now();

-- 3. Create Categories
create table public.categories (
  id text primary key,
  name text not null,
  parent_id text references public.categories(id),
  image text,
  is_active boolean default true,
  slug text,
  created_at timestamptz default now()
);

-- Seed Categories
insert into public.categories (id, name, parent_id, image) values
('c1', 'Сортовой прокат', null, 'https://images.unsplash.com/photo-1626284620359-994df7ee1912?auto=format&fit=crop&q=80&w=500'),
('c2', 'Листовой прокат', null, 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=500'),
('c3', 'Трубный прокат', null, 'https://images.unsplash.com/photo-1535063406549-defdccf96d18?auto=format&fit=crop&q=80&w=500'),
('c4', 'Фасонный прокат', null, 'https://images.unsplash.com/photo-1533069151839-44d4c51bb317?auto=format&fit=crop&q=80&w=500'),
('c1-1', 'Арматура', 'c1', null),
('c1-2', 'Катанка', 'c1', null),
('c2-1', 'Лист г/к', 'c2', null),
('c2-2', 'Лист х/к', 'c2', null),
('c3-1', 'Труба профильная', 'c3', null),
('c4-1', 'Балка двутавровая', 'c4', null),
('c4-2', 'Швеллер', 'c4', null)
on conflict (id) do nothing;

-- 4. Create Products
create table public.products (
  id uuid default gen_random_uuid() primary key,
  seller_id uuid references public.profiles(id) not null,
  category_id text references public.categories(id) not null,
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
  status text default 'MODERATION', -- Default to MODERATION for safety
  moderation_comment text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. Create Leads
create table public.leads (
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

-- 6. Create Import Logs
create table public.excel_import_logs (
  id uuid default gen_random_uuid() primary key,
  seller_id uuid references public.profiles(id) not null,
  file_name text,
  status text check (status in ('SUCCESS', 'FAILED', 'PROCESSING')),
  row_count int,
  created_at timestamptz default now()
);

-- 7. Create Admin Logs (Security)
create table public.admin_logs (
  id uuid default gen_random_uuid() primary key,
  admin_id uuid references public.profiles(id),
  action text not null,
  target_id text,
  details jsonb,
  ip_address text,
  created_at timestamptz default now()
);

-- 8. Enable RLS
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.leads enable row level security;
alter table public.excel_import_logs enable row level security;
alter table public.admin_logs enable row level security;

-- 9. Policies
-- Categories (Public Read)
create policy "Categories are viewable by everyone" on public.categories for select using (true);

-- Products
create policy "Public products are viewable by everyone" on public.products for select using (status = 'ACTIVE');
create policy "Sellers can manage own products" on public.products for all using (auth.uid() = seller_id);

-- Leads
create policy "Sellers can view own leads" on public.leads for select using (auth.uid() = seller_id);
create policy "Everyone can insert leads" on public.leads for insert with check (true);

-- Import Logs
create policy "Sellers can view own logs" on public.excel_import_logs for select using (auth.uid() = seller_id);
create policy "Sellers can insert logs" on public.excel_import_logs for insert with check (auth.uid() = seller_id);

-- Admin Access Policy (Simplified for demo: relies on backend checks mostly, but in real Prod we need is_admin flag in JWT)
-- Ideally: create policy "Admins can do everything" on ... using ((auth.jwt() ->> 'role') = 'ADMIN');

-- 10. Trigger for New User
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, name, role, company_name, verification_status)
  values (
    new.id, 
    new.email, 
    coalesce(new.raw_user_meta_data->>'name', 'Пользователь'), 
    coalesce(new.raw_user_meta_data->>'role', 'BUYER'),
    new.raw_user_meta_data->>'company_name',
    CASE WHEN (new.raw_user_meta_data->>'role') = 'SELLER' THEN 'PENDING' ELSE 'VERIFIED' END
  );
  return new;
exception
  when others then
    return new; 
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
