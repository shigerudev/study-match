# Configuración local de Supabase

La base de datos del MVP se define en:

- `supabase/migrations/202607160001_initial_schema.sql`
- `supabase/seed.sql`

## Aplicación

1. Crear el proyecto de desarrollo en Supabase.
2. Abrir **SQL Editor** y ejecutar primero la migración completa.
3. Ejecutar `supabase/seed.sql` para cargar los cinco perfiles, seis publicaciones y dos sesiones de demostración.
4. En **Authentication → URL Configuration**, añadir `http://localhost:3000` y la URL de producción de Vercel.
5. Copiar `Project URL` y `Publishable key` a `.env.local`, tomando `.env.example` como plantilla.

Las migraciones también son compatibles con Supabase CLI:

```bash
supabase link --project-ref <project-ref>
supabase db push
supabase db seed
```

## Seguridad incluida

- RLS está habilitado en todas las tablas del esquema público.
- Lecturas de feed, materias y perfiles son públicas para permitir la demo sin login.
- Escrituras y datos privados se limitan al perfil asociado al usuario autenticado.
- `record_swipe` calcula compatibilidad en el servidor, sin confiar score ni razones al cliente.
- Los buckets `avatars` y `posts` son públicos solo para lectura; las cargas requieren autenticación y propiedad del objeto.

## Nota para la demo

Los perfiles semilla no pertenecen a `auth.users`, por lo que sirven para lectura y como contenido de la interfaz. Al habilitar registro real, el trigger `handle_new_user` crea un perfil enlazado automáticamente. Para demostrar el flujo completo con Supabase Auth, creen un usuario de prueba y completen sus materias y disponibilidad; alternativamente el frontend puede conservar el modo mock hasta el final de la hackatón.
