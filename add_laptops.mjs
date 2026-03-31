import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vgsdvwhizrmlalunxvuj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnc2R2d2hpenJtbGFsdW54dnVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0OTM1MDIsImV4cCI6MjA5MDA2OTUwMn0.YHvA0nypQQmOQbRx5ZVtK3QsxaMELSsUMgg9uWMOKgs'; // Using the key from your .env
const supabase = createClient(supabaseUrl, supabaseKey);

async function addLaptops() {
  const laptops = [
    {
      id: 'lenovo-legion-pro-7',
      name: 'Legion Pro 7i Gen 9',
      brand: 'Lenovo',
      type: 'GAMING',
      cpu: 'Intel Core i9-14900HX',
      gpu: 'RTX 4080 12GB',
      ram: '32GB DDR5',
      price: 2699,
      discount: 5,
      storage: '1TB NVMe Gen4',
      image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80'
    },
    {
      id: 'asus-rog-scar-18-2024',
      name: 'ROG Strix SCAR 18',
      brand: 'ASUS',
      type: 'GAMING',
      cpu: 'Intel Core i9-14900HX',
      gpu: 'RTX 4090 16GB',
      ram: '64GB DDR5',
      price: 3899,
      discount: 0,
      storage: '2TB NVMe Raid 0',
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80'
    },
    {
      id: 'apple-macbook-air-15-m3-24',
      name: 'MacBook Air 15" (M3)',
      brand: 'Apple',
      type: 'OFFICE',
      cpu: 'Apple M3 8-Core',
      gpu: 'Apple 10-Core GPU',
      ram: '16GB Unified',
      price: 1499,
      discount: 0,
      storage: '512GB SSD',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80'
    },
    {
      id: 'dell-xps-13-9340-new',
      name: 'XPS 13 (9340) OLED',
      brand: 'Dell',
      type: 'OFFICE',
      cpu: 'Intel Core Ultra 7',
      gpu: 'Intel Arc Graphics',
      ram: '32GB LPDDR5x',
      price: 1799,
      discount: 10,
      storage: '1TB SSD',
      image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80'
    }
  ];

  for (const laptop of laptops) {
    const { data, error } = await supabase.from('products').upsert(laptop);
    if (error) {
      console.error(`Error adding ${laptop.name}:`, error.message);
    } else {
      console.log(`Successfully added/updated: ${laptop.name}`);
    }
  }
}

addLaptops();
