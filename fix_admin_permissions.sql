-- FIX FOR ADMIN VISIBILITY & USER SYNC
-- Run this in your Supabase SQL Editor

-- 1. Ensure the trigger function exists and is correct
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'New User'), 
    new.raw_user_meta_data->>'avatar_url',
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Re-create the trigger if it doesn't exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Add policy so Admins can see ALL profiles (CRITICAL FIX)
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 4. Sync existing users who might be missing from the profiles table
INSERT INTO public.profiles (id, full_name, avatar_url, role)
SELECT 
  id, 
  COALESCE(raw_user_meta_data->>'full_name', 'User'), 
  raw_user_meta_data->>'avatar_url',
  'user'
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 5. IMPORTANT: Promote YOURSELF to admin. 
-- Replace 'YOUR_EMAIL@HERE.com' with the email you use to log in.
UPDATE public.profiles 
SET role = 'admin' 
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@nexa.kg');

-- Alternatively, if you know your ID, use this:
-- UPDATE public.profiles SET role = 'admin' WHERE id = 'YOUR-UUID-HERE';
page.tsx:332 Update Error Full: 
{code: '42P17', details: null, hint: null, message: 'infinite recursion detected in policy for relation "profiles"'}
code
: 
"42P17"
details
: 
null
hint
: 
null
message
: 
"infinite recursion detected in policy for relation \"profiles\""
[[Prototype]]
: 
Object