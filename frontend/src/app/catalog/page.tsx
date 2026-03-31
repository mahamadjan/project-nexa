import { supabase } from '@/lib/supabase';
import CatalogClient from './CatalogClient';

export const dynamic = 'force-dynamic'; // Ensure we get fresh data on every visit

export default async function CatalogPage() {
  // 1. Fetch REAL products on the SERVER before anyone sees the page
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  // 2. Pass the REAL data to the CLIENT component
  // This will be used as the INITIAL state, so there is NO RE-RENDER on mount
  return <CatalogClient initialProducts={products || []} />;
}
