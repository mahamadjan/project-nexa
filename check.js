const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('products').select('*');
  console.log('PRODUCTS IN DB:', data?.length);
  if (data) {
    data.forEach(p => console.log(`- ${p.id}: ${p.name}`));
  }
  if (error) console.error(error);
}

run();
