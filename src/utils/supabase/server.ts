import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
// filepath: c:\Users\dhrey\Documents\UMG\SEMESTRE 7\ANALISIS DE SISTEMAS - PROYECTO\FrontEnd_Cliente\src\utils\supabase\server.ts
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createSupabaseClient(supabaseUrl, supabaseKey);
}

export async function createClientServer() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value ?? null; // Manejar null en lugar de cadena vacía
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set(name, value, options ?? {}); // Next.js maneja las cookies correctamente aquí
        },
        remove(name: string) {
          cookieStore.set(name, '', { maxAge: -1 }); // Método para eliminar cookies
        }
      },
    }
  );
}
