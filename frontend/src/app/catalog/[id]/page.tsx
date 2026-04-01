import { supabase } from '@/lib/supabase';
import ProductClient from './ProductClient';

export const dynamic = 'force-dynamic';

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // 1. Fetch on the Server, completely bypassing User Browser restrictions!
  let product = null;
  let serverError = null;
  
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id);
    
    if (error) {
      serverError = error.message;
    } else if (data && data.length > 0) {
      const item = data[0];
      product = {
        ...item,
        description: item.description || 'Испытайте невероятную мощь и изысканный дизайн с последним поколением мобильных рабочих станций NEXA.',
        display: item.display || '16" Mini-LED 4K 144Hz',
        ports: item.ports || '2x Thunderbolt 4, 3x USB-A, HDMI 2.1, SD Card',
        image: item.image || 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=800&auto=format&fit=crop'
      };
    }
  } catch (err: any) {
    serverError = err.message || 'Server Exception';
  }

  // 2. Pass parsed product directly to Client Component
  return <ProductClient product={product} id={id} />;
}
