
-- MASTER FIX SCRIPT
-- 1. Drop tables that depend on categories or have wrong types (Data in these tables will be reset!)
drop table if exists public.excel_import_logs cascade;
drop table if exists public.leads cascade;
drop table if exists public.products cascade;
drop table if exists public.categories cascade;

-- Note: We do NOT drop 'profiles' to keep your users.

-- 2. Create Categories with TEXT ID (Fixes "invalid input syntax for type uuid")
create table public.categories (
  id text primary key, -- Changed from UUID to TEXT to support "c1", "c1-1"
  name text not null,
  parent_id text references public.categories(id),
  image text,
  created_at timestamptz default now()
);

-- 3. SEED CATEGORIES (Critical: Products cannot be created without existing categories)
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

-- 4. Recreate Products with correct Foreign Key type
create table public.products (
  id uuid default gen_random_uuid() primary key,
  seller_id uuid references public.profiles(id) not null,
  category_id text references public.categories(id) not null, -- Changed to TEXT
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

-- 5. Recreate other tables
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

create table public.excel_import_logs (
  id uuid default gen_random_uuid() primary key,
  seller_id uuid references public.profiles(id) not null,
  file_name text,
  status text check (status in ('SUCCESS', 'FAILED', 'PROCESSING')),
  row_count int,
  created_at timestamptz default now()
);

-- 6. Re-enable RLS
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.leads enable row level security;
alter table public.excel_import_logs enable row level security;

-- 7. Re-apply Policies
-- Categories (Public Read)
create policy "Categories are viewable by everyone" on public.categories for select using (true);

-- Products
create policy "Public products are viewable by everyone" on public.products for select using (status = 'ACTIVE');
create policy "Sellers can manage own products" on public.products for all using (auth.uid() = seller_id);

-- Leads
create policy "Sellers can view own leads" on public.leads for select using (auth.uid() = seller_id);
create policy "Everyone can insert leads" on public.leads for insert with check (true); -- Allow buyers to create leads

-- Import Logs
create policy "Sellers can view own logs" on public.excel_import_logs for select using (auth.uid() = seller_id);
create policy "Sellers can insert logs" on public.excel_import_logs for insert with check (auth.uid() = seller_id);

-- Profiles (Ensure these exist from previous fixes)
drop policy if exists "Users can see own profile" on public.profiles;
create policy "Users can see own profile" on public.profiles for select using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- 8. Ensure Trigger exists (Just in case)
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
    return new; 
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
