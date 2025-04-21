import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

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
