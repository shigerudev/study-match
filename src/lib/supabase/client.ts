import { createClient } from "@supabase/supabase-js";

/**
 * Cliente para consultas realizadas desde el navegador.
 * Las credenciales públicas se definen en `.env.local` y las tablas deben
 * protegerse con Row Level Security antes de habilitar datos reales.
 */
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. Copia .env.example a .env.local y completa los valores.",
    );
  }

  return createClient(url, publishableKey);
}
