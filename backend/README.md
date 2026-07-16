# Backend — StudyMatch

API Express + Supabase del MVP. Contiene la lógica de negocio, endpoints,
pruebas y el script que aplica el esquema y los datos semilla de Antonio.

El esquema canónico está en `../supabase/migrations/` y los datos demo en
`../supabase/seed.sql`. La API no mantiene un esquema duplicado.

## Requisitos (una sola vez)

1. Proyecto vacío en [Supabase](https://supabase.com).

## Configuración automática

```bash
cp .env.example .env
```

Completa en `.env`:

| Variable | Dónde obtenerla |
| --- | --- |
| `SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → `service_role` |
| `DATABASE_URL` | Supabase → Settings → Database → URI |

Luego:

```bash
npm install
npm run db:setup
```

Eso aplica la migración canónica si el esquema aún no existe y siempre
reaplica el seed idempotente de `../supabase/seed.sql`.

## Validación del backend

```bash
npm run dev
npm test
```

La ejecución local solo sirve para validar la API. La configuración y el despliegue
en Vercel corresponden al responsable full stack.

## Endpoints

Ver `../SPECS.md` §8. Perfil demo de Sofía:
`00000000-0000-4000-8000-000000000001`.

## Despliegue (Hugo)

La app exporta Express desde `src/index.js` y no escucha puerto cuando
`VERCEL=1`. En Vercel, usa **Root Directory** = `backend` y configura:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Luego apunta el frontend a la URL pública con, por ejemplo,
`NEXT_PUBLIC_API_URL`.

## Colección para integración

Importa `StudyMatch.postman_collection.json` en Postman y ejecuta las requests
en orden. La colección cubre el recorrido completo:

1. health, clases, feed y perfil;
2. omitir Diego y hacer match con María;
3. crear y aceptar una sesión;
4. consultar sesiones, guardados y crear una publicación.

La variable `baseUrl` inicia en `http://localhost:3001`; Hugo puede sustituirla
por la URL pública del backend. Para repetir el flujo de escritura, ejecuta
`npm run db:setup` y vuelve a importar/restablecer las variables de la colección.
