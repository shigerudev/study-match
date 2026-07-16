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

Eso crea tablas y datos semilla **sin usar el SQL Editor**.

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
