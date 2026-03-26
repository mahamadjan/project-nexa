-- BACKEND SCHEMA FOR NEXA E-COMMERCE
-- Designed for Supabase (PostgreSQL)

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles Table (Extends Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  type TEXT NOT NULL,
  cpu TEXT,
  gpu TEXT,
  ram TEXT,
  price NUMERIC NOT NULL,
  storage TEXT,
  image TEXT,
  discount NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Favorites Table
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- 5. Cart Items Table
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Orders Table (Updated to match frontend flat structure)
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  customer TEXT NOT NULL,
  email TEXT NOT NULL,
  product TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  method TEXT,
  status TEXT DEFAULT 'new',
  phone TEXT,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_at_time NUMERIC NOT NULL
);

-- 8. Row Level Security (RLS) Policies

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Products: Everyone can view, only admins can modify
CREATE POLICY "Allow public read-only access on products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow admin full access on products" ON public.products FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Profiles: Users can view and update their own profiles
CREATE POLICY "Allow users to view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Allow users to update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Favorites: Users can manage their own favorites
CREATE POLICY "Allow users to manage their own favorites" ON public.favorites FOR ALL USING (auth.uid() = user_id);

-- Cart: Users can manage their own cart
CREATE POLICY "Allow users to manage their own cart items" ON public.cart_items FOR ALL USING (auth.uid() = user_id);

-- Orders: Admin can see all, users can see their own, everyone can create (to allow guest orders)
CREATE POLICY "Admin can full access on orders" ON public.orders FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT WITH CHECK (true);

-- Order Items: Admin can see all, users can see their own
CREATE POLICY "Admin can full access on order_items" ON public.order_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Users can view their own order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE id::text = order_items.order_id::text AND user_id = auth.uid())
);

-- 9. Trigger: Create Profile on Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 10. Seed Data (Initial Products)
INSERT INTO public.products (id, name, brand, type, cpu, gpu, ram, price, storage, image, discount) VALUES
('nexa-1', 'NexaBlade 16 Pro', 'NEXA', 'GAMING', 'Intel Core i9-14900HX', 'RTX 4090 16GB', '64GB DDR5', 3499, '2TB NVMe', 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&q=80', 0),
('nexa-2', 'NexaWork Ultra 15', 'NEXA', 'OFFICE', 'Intel Core Ultra 7', 'Intel Arc Graphics', '32GB DDR5', 1599, '1TB SSD', 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80', 0),
('nexa-3', 'NexaBlade 14 Stealth', 'NEXA', 'GAMING', 'AMD Ryzen 9 8945HS', 'RTX 4070 8GB', '32GB DDR5', 1899, '1TB NVMe', 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80', 0),
('nexa-4', 'NexaBook Air 13', 'NEXA', 'OFFICE', 'Intel Core i5-1335U', 'Intel Iris Xe', '16GB DDR4', 899, '512GB SSD', 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80', 0),
('nexa-5', 'NexaStation X 17', 'NEXA', 'OFFICE', 'Intel Core i9-14900HX', 'RTX 5000 Ada', '128GB DDR5', 4999, '4TB NVMe', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80', 0),
('nexa-6', 'NexaBlade 18 Max', 'NEXA', 'GAMING', 'Intel Core i9-14980HX', 'RTX 4090 TI 20GB', '96GB DDR5', 4299, '4TB NVMe', 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80', 0),
('apple-1', 'MacBook Pro 14 M3', 'Apple', 'OFFICE', 'Apple M3 Pro', '14-core GPU', '18GB Unified', 1999, '512GB SSD', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80', 0),
('apple-2', 'MacBook Pro 16 M3 Max', 'Apple', 'OFFICE', 'Apple M3 Max', '40-core GPU', '64GB Unified', 3999, '1TB SSD', 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80', 0),
('apple-3', 'MacBook Air 15 M3', 'Apple', 'OFFICE', 'Apple M3', '10-core GPU', '16GB Unified', 1699, '512GB SSD', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80', 0),
('apple-4', 'MacBook Air 13 M2', 'Apple', 'OFFICE', 'Apple M2', '8-core GPU', '8GB Unified', 999, '256GB SSD', 'https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=800&q=80', 0),
('apple-5', 'MacBook Pro 16 M1 Max', 'Apple', 'OFFICE', 'Apple M1 Max', '32-core GPU', '64GB Unified', 1749, '2TB SSD', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80', 50),
('apple-6', 'MacBook Air 13 M1', 'Apple', 'OFFICE', 'Apple M1', '7-core GPU', '8GB Unified', 499, '256GB SSD', 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80', 50),
('apple-7', 'MacBook Pro 14 M2 Pro', 'Apple', 'OFFICE', 'Apple M2 Pro', '16-core GPU', '16GB Unified', 1599, '512GB SSD', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80', 20),
('apple-8', 'MacBook Pro 16 M2 Max', 'Apple', 'OFFICE', 'Apple M2 Max', '38-core GPU', '32GB Unified', 2799, '1TB SSD', 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80', 15),
('apple-9', 'MacBook Air 15 M2', 'Apple', 'OFFICE', 'Apple M2', '10-core GPU', '16GB Unified', 1099, '512GB SSD', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80', 10),
('apple-10', 'MacBook Pro 14 M3 Max', 'Apple', 'OFFICE', 'Apple M3 Max', '30-core GPU', '36GB Unified', 3199, '1TB SSD', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80', 0),
('razer-1', 'Razer Blade 16', 'Razer', 'GAMING', 'i9-14900HX', 'RTX 4080', '32GB', 3299, '1TB', 'https://images.unsplash.com/photo-1544244015-0cd4b3ffc6b0?w=800&q=80', 0),
('razer-2', 'Razer Blade 14 Mercury', 'Razer', 'GAMING', 'Ryzen 9 8945HS', 'RTX 4070', '16GB', 2399, '1TB', 'https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?w=800&q=80', 0),
('asus-1', 'ROG Zephyrus G16', 'ASUS', 'GAMING', 'i9-14900H', 'RTX 4070', '32GB', 2199, '1TB', 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80', 0),
('lenovo-1', 'Legion 9i Gen 8', 'Lenovo', 'GAMING', 'i9-13980HX', 'RTX 4090', '32GB', 3599, '2TB', 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80', 0),
('msi-1', 'MSI Titan 18 HX', 'MSI', 'GAMING', 'i9-14900HX', 'RTX 4090', '128GB', 2499, '4TB', 'https://images.unsplash.com/photo-1589561084283-f3044a84d4dd?w=800&q=80', 50),
('alienware-1', 'Alienware m18 R2', 'Dell', 'GAMING', 'i9-14900HX', 'RTX 4090', '64GB', 3799, '4TB', 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80', 0),
('razer-3', 'Razer Blade 18 Pro', 'Razer', 'GAMING', 'i9-14900HX', 'RTX 4090', '64GB', 4499, '2TB', 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&q=80', 0),
('asus-2', 'ROG Strix SCAR 18', 'ASUS', 'GAMING', 'i9-14900HX', 'RTX 4090', '64GB', 3899, '2TB', 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80', 0),
('lenovo-2', 'Legion Pro 7i Gen 9', 'Lenovo', 'GAMING', 'i9-14900HX', 'RTX 4080', '32GB', 1349, '1TB', 'https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?w=800&q=80', 50),
('hp-1', 'HP Omen Transcend 14', 'HP', 'GAMING', 'Ultra 9', 'RTX 4070', '32GB', 1999, '1TB', 'https://images.unsplash.com/photo-1531297172867-4f54e14fcceb?w=800&q=80', 0),
('msi-2', 'MSI Stealth 16 AI', 'MSI', 'GAMING', 'Ultra 9', 'RTX 4080', '32GB', 2799, '2TB', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80', 0),
('razer-4', 'Razer Blade 15 Refurb', 'Razer', 'GAMING', 'i7-12800H', 'RTX 3070 Ti', '16GB', 799, '512GB', 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80', 50),
('g-7', 'GIGABYTE G5 KF', 'GIGABYTE', 'GAMING', 'i5-12500H', 'RTX 4060', '16GB', 449, '512GB', 'https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?w=800&q=80', 50),
('msi-3', 'MSI Katana 15', 'MSI', 'GAMING', 'i7-13620H', 'RTX 4070', '16GB', 1399, '1TB', 'https://images.unsplash.com/photo-1589561084283-f3044a84d4dd?w=800&q=80', 0),
('dell-1', 'XPS 16 9640', 'Dell', 'OFFICE', 'Ultra 9', 'RTX 4070', '64GB', 2999, '2TB', 'https://images.unsplash.com/photo-1593642532400-2682810df593?w=800&q=80', 0),
('dell-2', 'XPS 14 9440', 'Dell', 'OFFICE', 'Ultra 7', 'RTX 4050', '32GB', 2299, '1TB', 'https://images.unsplash.com/photo-1585076694454-941517c56962?w=800&q=80', 0),
('lenovo-3', 'ThinkPad X1 Carbon G12', 'Lenovo', 'OFFICE', 'Ultra 7', 'Intel Arc', '32GB', 1899, '1TB', 'https://images.unsplash.com/photo-1516387784550-dd9395a49191?w=800&q=80', 0),
('lenovo-4', 'ThinkPad Z13 Gen 2', 'Lenovo', 'OFFICE', 'Ryzen 7 7840U', '780M', '32GB', 1499, '1TB', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80', 0),
('ms-1', 'Surface Laptop 5', 'Microsoft', 'OFFICE', 'i7-1255U', 'Iris Xe', '16GB', 649, '512GB', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80', 50),
('ms-2', 'Surface Laptop Studio 2', 'Microsoft', 'OFFICE', 'i7-13700H', 'RTX 4060', '64GB', 3299, '2TB', 'https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=800&q=80', 0),
('hp-2', 'HP Spectre x360 14', 'HP', 'OFFICE', 'Ultra 7', 'Intel Arc', '16GB', 1449, '512GB', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80', 0),
('asus-3', 'Zenbook Duo 2024', 'ASUS', 'OFFICE', 'Ultra 9', 'Intel Arc', '32GB', 2099, '2TB', 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&q=80', 0),
('lg-1', 'LG Gram 17 2024', 'LG', 'OFFICE', 'Ultra 7', 'Arc', '32GB', 899, '1TB', 'https://images.unsplash.com/photo-1544244015-0cd4b3ffc6b0?w=800&q=80', 50),
('lenovo-5', 'Yoga Slim 9i', 'Lenovo', 'OFFICE', 'i7-1360P', 'Iris Xe', '16GB', 1499, '1TB', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80', 0),
('bud-1', 'Gateway Ultra Slim', 'Gateway', 'OFFICE', 'Celeron N4020', 'UHD 600', '4GB', 149, '128GB', 'https://images.unsplash.com/photo-1516387784550-dd9395a49191?w=800&q=80', 50),
('bud-2', 'Asus Vivobook Go', 'ASUS', 'OFFICE', 'Ryzen 3 7320U', '610M', '8GB', 449, '256GB', 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80', 0),
('bud-3', 'HP Laptop 15 Cheap', 'HP', 'OFFICE', 'i3-1215U', 'UHD', '8GB', 199, '256GB', 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80', 50),
('bud-4', 'Lenovo IdeaPad 1', 'Lenovo', 'OFFICE', 'Ryzen 5 5500U', 'Vega 7', '12GB', 549, '512GB', 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80', 0),
('acer-2', 'Acer Swift Edge 16 OLED', 'Acer', 'OFFICE', 'Ryzen 7 7840U', '780M', '16GB', 499, '1TB', 'https://images.unsplash.com/photo-1544244015-0cd4b3ffc6b0?w=800&q=80', 50),
('hp-3', 'HP Victus 16 Budget', 'HP', 'GAMING', 'Ryzen 7 7840HS', 'RTX 4060', '16GB', 1099, '512GB', 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&q=80', 0),
('acer-3', 'Acer Nitro V 15', 'Acer', 'GAMING', 'i5-13420H', 'RTX 4050', '16GB', 799, '512GB', 'https://images.unsplash.com/photo-1580522151917-adbe7ddd330d?w=800&q=80', 0),
('asus-4', 'Asus Vivobook Pro 16', 'ASUS', 'OFFICE', 'i9-13900H', 'RTX 4060', '32GB', 1599, '1TB', 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80', 0),
('samsung-1', 'Samsung Galaxy Book 3', 'Samsung', 'OFFICE', 'Ultra 9', 'UHD', '16GB', 703, '512GB', 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80', 0),
('lg-2', 'LG Flow Ultra Thin', 'LG', 'OFFICE', 'Ultra 7', 'Arc', '16GB', 523, '512GB', 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80', 50)
ON CONFLICT (id) DO NOTHING;
