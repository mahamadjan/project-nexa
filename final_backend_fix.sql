-- =======================================================
-- DEFINITIVE BACKEND FIX — Run this ONCE in Supabase SQL Editor
-- =======================================================

-- STEP 1: Create admin check function (prevents infinite recursion in RLS)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
DECLARE
  user_role text;
BEGIN
  SELECT role INTO user_role FROM public.profiles WHERE id = auth.uid();
  RETURN user_role = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- STEP 2: Fix orders table - remove bad FK and add ALL missing columns
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS method TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS amount NUMERIC DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS product TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Re-add FK to auth.users (NOT profiles) with SET NULL behavior
ALTER TABLE public.orders
  ADD CONSTRAINT orders_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- STEP 3: Fix products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0;

-- STEP 4: Remove ALL old broken policies (including from previous run attempts)
DROP POLICY IF EXISTS "Admin can full access on orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
DROP POLICY IF EXISTS "Orders select policy" ON public.orders;
DROP POLICY IF EXISTS "orders_insert" ON public.orders;
DROP POLICY IF EXISTS "orders_select" ON public.orders;
DROP POLICY IF EXISTS "orders_update" ON public.orders;
DROP POLICY IF EXISTS "Allow admin full access on products" ON public.products;
DROP POLICY IF EXISTS "Admin can full access on products" ON public.products;
DROP POLICY IF EXISTS "select_products_all" ON public.products;
DROP POLICY IF EXISTS "write_products_admin" ON public.products;
DROP POLICY IF EXISTS "Allow public read-only access on products" ON public.products;
DROP POLICY IF EXISTS "Products admin policy" ON public.products;
DROP POLICY IF EXISTS "products_select" ON public.products;
DROP POLICY IF EXISTS "products_write" ON public.products;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Profiles visibility" ON public.profiles;
DROP POLICY IF EXISTS "select_profiles" ON public.profiles;
DROP POLICY IF EXISTS "update_profiles" ON public.profiles;
DROP POLICY IF EXISTS "update_profiles" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;

-- STEP 5: Create clean new policies
-- Orders: anyone can insert, users can see own, admin sees all
CREATE POLICY "orders_insert" ON public.orders FOR INSERT WITH CHECK (true);

CREATE POLICY "orders_select" ON public.orders FOR SELECT USING (
  is_admin()
  OR auth.uid() = user_id
  OR (email IS NOT NULL AND email = (SELECT email FROM auth.users WHERE id = auth.uid()))
);

CREATE POLICY "orders_update" ON public.orders FOR UPDATE USING (is_admin());

-- Profiles: users see own, admin sees all
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (
  auth.uid() = id OR is_admin()
);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Products: public read, admin writes
CREATE POLICY "products_select" ON public.products FOR SELECT USING (true);
CREATE POLICY "products_write" ON public.products FOR ALL USING (is_admin());

-- STEP 6: Promote YOUR account to admin
-- *** CHANGE admin@nexa.kg to your actual email if different ***
UPDATE public.profiles 
SET role = 'admin' 
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@nexa.kg');

-- STEP 7: Sync users missing from profiles
INSERT INTO public.profiles (id, full_name, role)
SELECT 
  id, 
  COALESCE(raw_user_meta_data->>'full_name', 'User'),
  'user'
FROM auth.users
ON CONFLICT (id) DO NOTHING;
