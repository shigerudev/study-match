# Backend — StudyMatch

API Express + Supabase del MVP. Este directorio contiene los entregables de Antonio:
modelos SQL, datos semilla, lógica de negocio y endpoints.

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
```

La ejecución local solo sirve para validar la API. La configuración y el despliegue
en Vercel corresponden al responsable full stack.

## Endpoints

Ver `SPECS.md` §8. Usuario demo: `user-sofia`.
