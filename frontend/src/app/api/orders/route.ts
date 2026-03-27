import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const email = searchParams.get('email');

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    let query = supabase.from('orders').select('*');
    if (userId) query = query.eq('user_id', userId);
    else if (email) query = query.eq('email', email);

    const { data, error } = await query;
    if (error) return NextResponse.json({ data: [], error: error.message });
    return NextResponse.json({ data: data || [] });
  } catch {
    return NextResponse.json({ data: [], error: 'Connection failed' });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase.from('orders').insert([body]);
    if (error) return NextResponse.json({ data: null, error: error.message });
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ data: null, error: 'Connection failed' });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (error) return NextResponse.json({ error: error.message });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Connection failed' });
  }
}
