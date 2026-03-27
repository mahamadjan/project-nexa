import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  if (typeof window !== 'undefined') {
    console.error('Supabase credentials missing! Database features will fail.');
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    fetch: (url, options) => {
      return fetch(url, options).catch(err => {
        // Silently swallow ALL network-level fetch errors (ERR_HTTP2_PROTOCOL_ERROR, ERR_CONNECTION_RESET etc.)
        // These happen when Supabase is sleeping or the network blocks HTTP/2
        // The caller's try/catch will handle the null response gracefully
        return new Response(JSON.stringify({ error: { message: err.message, code: 'NETWORK_ERROR' } }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        });
      });
    }
  }
});
