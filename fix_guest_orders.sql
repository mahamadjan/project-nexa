-- Этот скрипт разрешает всем пользователям (даже без регистрации) оформлять заказы.
-- Ранее политика (RLS) блокировала сохранение в базу данных для гостей.

DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON "public"."orders";

-- разрешаем любому (public) делать INSERT в orders
DROP POLICY IF EXISTS "Enable insert for anyone" ON "public"."orders";
CREATE POLICY "Enable insert for anyone" 
ON "public"."orders" 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Чтобы администратор всегда мог читать все заказы (даже созданные гостями)
DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."orders";
CREATE POLICY "Enable read access for all users"
ON "public"."orders"
FOR SELECT
TO public
USING (true);

-- Чтобы изменение статуса через админку успешно сохранялось в базе
DROP POLICY IF EXISTS "Enable update for anyone" ON "public"."orders";
CREATE POLICY "Enable update for anyone"
ON "public"."orders"
FOR UPDATE 
TO public
USING (true) WITH CHECK (true);

