# Integraciones: MCP, API y despliegue

## Estado inicial

El proyecto usa dos servicios externos:

| Servicio | Propósito | Conexión |
| --- | --- | --- |
| Supabase | Base de datos, autenticación y almacenamiento de medios. | MCP remoto + API de JavaScript. |
| Vercel | Despliegue de la aplicación Next.js y previews. | MCP remoto + integración con GitHub. |

El archivo [`.mcp.json`](../.mcp.json) contiene únicamente los endpoints oficiales; no contiene secretos. Cada integrante debe autorizar OAuth con su propia cuenta antes de ejecutar herramientas que administren recursos.

## Supabase

1. Autorizar el MCP de Supabase.
2. Crear un **proyecto de desarrollo** para StudyMatch; no conectar MCP a datos de producción.
3. Copiar la URL y la Publishable Key desde **Project Settings → API** a `.env.local`, tomando `.env.example` como base.
4. Aplicar las tablas y políticas descritas en [`SPECS.md`](../SPECS.md).
5. Generar tipos TypeScript desde el MCP cuando el esquema esté listo.

Variables requeridas:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable-key>
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Seguridad

- Nunca subir `.env.local` ni claves `service_role` al repositorio.
- Habilitar Row Level Security en las tablas expuestas al cliente.
- Usar buckets separados para `avatars` y `posts`.
- Cuando exista el proyecto, actualizar la URL MCP de Supabase con `project_ref` para limitar el acceso a StudyMatch.

## API Express (`backend/`)

La API de Antonio usa el mismo esquema canónico de `supabase/` con la clave
`service_role` (solo servidor). Perfil demo de Sofía:
`00000000-0000-4000-8000-000000000001`.

```bash
cd backend
cp .env.example .env
npm install
npm run db:setup
npm run dev
```

Variables: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` y `DATABASE_URL`
(solo para `db:setup`). Detalle en [`backend/README.md`](../backend/README.md).

Para desplegar la API: en Vercel usa Root Directory `backend` y las dos
variables Supabase (sin `DATABASE_URL`). Importa
`backend/StudyMatch.postman_collection.json` para validar el flujo.

## Vercel

1. Autorizar el MCP de Vercel.
2. Importar el repositorio `shigerudev/study-match` en Vercel.
3. Agregar las tres variables de `.env.example` en **Environment Variables** para Preview y Production.
4. Desplegar `main`; los siguientes push crearán despliegues automáticos.
5. Agregar la URL de Vercel a `NEXT_PUBLIC_APP_URL` y a las URLs de redirección de Supabase Auth.

## Comandos locales

```bash
npm install
npm run dev
npm run lint
npm run build
```

## Dependencias ya instaladas

- `@supabase/supabase-js`: cliente de la API de Supabase.
- `motion`: animación y swipe del flujo Match.
- `lucide-react`: iconos de navegación y acciones.
