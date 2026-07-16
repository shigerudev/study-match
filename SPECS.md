# Especificación del MVP — StudyMatch

**Versión:** 1.1

**Estado:** MVP en demo (frontend en Vercel; datos mock en UI; esquema Supabase y API Express listos para conectar)

**Objetivo de demo:** una persona descubre contenido por clase, publica un recurso, realiza un match y agenda una sesión.

**URL de demo:** https://study-match-mp4cusjeq-hugo-arias-projects.vercel.app

## 1. Visión del producto

StudyMatch es una comunidad académica móvil donde estudiantes y profesores comparten recursos breves, descubren contenido por clases y encuentran personas compatibles para estudiar o enseñar.

El diferencial del MVP es unir tres acciones en una experiencia: **aprender desde el feed, conectar con alguien compatible y convertir la conexión en una sesión programada**.

## 2. Alcance

### Incluido en el MVP

- Perfil de usuario con rol de estudiante, profesor o ambos.
- Feed de publicaciones académicas de foto y video corto.
- Búsqueda por usuario, clase, título y etiqueta.
- Filtro por categorías de clase.
- Creación de una publicación usando archivo o contenido de ejemplo.
- Descubrimiento de perfiles en Match mediante swipe o botones.
- Match mutuo simulado o calculado con datos semilla.
- Solicitud y confirmación de una sesión de estudio.
- Perfil con publicaciones, sesiones y guardados.

### Fuera de alcance

- Autenticación de producción y recuperación de cuenta.
- Chat, notificaciones en tiempo real o videollamadas.
- Carga y procesamiento de video de producción.
- Pagos, suscripciones y monetización.
- Moderación automática, reportes y analítica avanzada.

## 3. Usuarios y objetivos

| Persona | Necesidad | Resultado esperado |
| --- | --- | --- |
| Estudiante | Encontrar ayuda en una materia y compañeros compatibles. | Agenda una sesión con una persona afín. |
| Profesor/mentor | Compartir conocimiento y encontrar estudiantes interesados. | Publica un recurso y recibe solicitudes de sesión. |
| Usuario mixto | Aprender una materia y apoyar en otra. | Configura ambos intereses en un solo perfil. |

## 4. Navegación móvil

La navegación inferior tiene cinco destinos (implementados en Next.js App Router):

| Destino | Ruta | Contenido |
| --- | --- | --- |
| Inicio | `/home` | Feed, búsqueda y categorías de clases. |
| Clases | `/classes` | Exploración de todas las clases y sus publicaciones. |
| Crear (`+`) | `/create` | Formulario para foto o video corto. |
| Match | `/match` | Tarjetas de perfiles compatibles. |
| Perfil | `/profile` | Información, publicaciones, sesiones y guardados. |

La landing `/` presenta la marca y enlaza a Inicio. Inicio contiene una barra de búsqueda superior y categorías horizontales: `Todo`, `Cálculo`, `Inglés`, `Física`, `Programación` y `Diseño`.

## 5. Historias de usuario y aceptación

### US-01 — Crear/editar perfil

Como usuario, quiero registrar mi rol, materias, intereses, objetivos y disponibilidad para obtener recomendaciones relevantes.

- El perfil permite elegir `estudiante`, `profesor` o `ambos`.
- Se requiere nombre, al menos una materia y al menos un bloque de disponibilidad.
- Al guardar, estos datos aparecen en Perfil y se usan para la compatibilidad.

### US-02 — Explorar publicaciones

Como usuario, quiero explorar recursos académicos por clase para aprender rápidamente.

- Inicio muestra publicaciones de datos semilla ordenadas de forma determinista.
- Una categoría filtra el feed sin salir de la pantalla.
- La búsqueda devuelve coincidencias por título, clase, etiqueta o autor.
- Cada publicación muestra autor, clase, tipo, título y recurso visual.

### US-03 — Crear publicación

Como usuario, quiero publicar una foto o video corto para compartir un recurso académico.

- El usuario selecciona `foto` o `video`.
- Debe indicar título y clase; descripción y etiquetas son opcionales.
- Al publicar, la tarjeta aparece al inicio del feed local.
- Si no existe carga real de archivos, se muestra una previsualización o recurso de ejemplo sin ocultar que es una demo.

### US-04 — Encontrar un match

Como usuario, quiero evaluar perfiles uno por uno para decidir con quién estudiar.

- Match presenta una tarjeta con avatar, nombre, rol, materias, objetivo, disponibilidad y porcentaje de compatibilidad.
- Deslizar a la izquierda equivale a **omitir**; a la derecha equivale a **mostrar interés**.
- Los botones `✕` y `♥` ejecutan las mismas acciones que los gestos.
- El porcentaje muestra al menos una razón de compatibilidad comprensible.
- Un interés mutuo muestra el estado **¡Hicieron match!** y permite avanzar a agenda.

### US-05 — Agendar sesión

Como usuario con un match, quiero proponer una sesión para estudiar en un horario concreto.

- Se elige fecha, hora, duración (30 o 60 minutos) y modalidad (`virtual` o `presencial`).
- La sesión se crea como `pendiente`.
- El receptor puede `aceptar` o `proponer cambio`.
- Una sesión aceptada aparece en la pestaña Sesiones de ambos perfiles.

### US-06 — Consultar perfil

Como usuario, quiero ver mi actividad y editar mi información.

- Perfil muestra avatar, nombre, rol, biografía, materias y disponibilidad.
- Tiene pestañas: Publicaciones, Sesiones y Guardados.
- Editar perfil actualiza los datos usados por Match.

## 6. Reglas de negocio

### Compatibilidad

El valor es explicable y puede utilizar datos semilla. Fórmula sobre 100 (también implementada en SQL como `public.match_score`):

| Señal | Puntos máximos |
| --- | ---: |
| Materias compartidas | 40 |
| Objetivo compatible | 20 |
| Coincidencia de disponibilidad | 25 |
| Nivel compatible | 15 |

La tarjeta debe mostrar la puntuación y una razón, por ejemplo: “Coinciden en Cálculo I y tienen disponibilidad por la tarde”.

### Estados

| Recurso | Estados / valores |
| --- | --- |
| Swipe (`decision`) | `skip`, `like` |
| Match | `activo`, `archivado` |
| Sesión | `pendiente`, `aceptada`, `cambio_propuesto`, `cancelada`, `completada` |
| Publicación | `publicada`, `eliminada` |
| Tipo de publicación | `foto`, `video` |

## 7. Modelo de datos (Supabase canónico)

Fuente de verdad del esquema: [`supabase/migrations/202607160001_initial_schema.sql`](./supabase/migrations/202607160001_initial_schema.sql) y seed en [`supabase/seed.sql`](./supabase/seed.sql).

```text
Subject
  id (uuid), name, slug, color, createdAt

Profile
  id (uuid), authUserId?, name, avatarUrl, role(estudiante|profesor|ambos),
  bio, career, goals[], availability (jsonb), createdAt, updatedAt

ProfileSubject
  profileId, subjectId, level (1-5), isTeaching

Post
  id, authorId, subjectId, type(foto|video), title, description,
  tags[], mediaUrl, status(publicada|eliminada), createdAt, updatedAt

SavedPost
  profileId, postId, createdAt

Swipe
  id, actorId, targetId, decision(skip|like), createdAt, updatedAt

Match
  id, userAId, userBId, score, reasons[], status(activo|archivado), createdAt

StudySession
  id, matchId, proposerId, scheduledAt, durationMinutes (30|60),
  modality(virtual|presencial), status, changeNote?, createdAt, updatedAt
```

Funciones de dominio en Supabase:

- `match_score(actor, target)` → puntuación y razones.
- `record_swipe(target, decision)` → registra swipe y crea match mutuo si aplica.
- `current_profile_id()` → perfil ligado a `auth.uid()`.

Storage: buckets `avatars` y `posts` (lectura pública en demo). RLS habilitado en las tablas públicas.

### Nota sobre `backend/`

La API Express en [`backend/`](./backend/) utiliza este mismo esquema canónico:
`profiles`, `profile_subjects`, `posts`, `swipes`, `matches` y
`study_sessions`. No mantiene un segundo esquema SQL.

## 8. Contrato de API

### 8.1 Express (`backend/`) — contrato HTTP del MVP

Base local: `http://localhost:3001`.

| Método | Ruta | Acción |
| --- | --- | --- |
| `GET` | `/api/health` | Estado del servicio. |
| `GET` | `/api/posts?subject=&q=&authorId=` | Obtener feed filtrado; `authorId` permite listar publicaciones del Perfil. |
| `POST` | `/api/posts` | Crear publicación. |
| `GET` | `/api/saved-posts?userId=` | Listar publicaciones guardadas del Perfil. |
| `GET` | `/api/subjects` | Listar clases. |
| `GET` | `/api/users/:id` | Consultar perfil. |
| `PATCH` | `/api/users/:id` | Editar perfil. |
| `GET` | `/api/matches/discover?userId=` | Obtener tarjeta siguiente. |
| `POST` | `/api/swipes` | Registrar `skip` o `like`; devuelve match si aplica. |
| `GET` | `/api/matches?userId=` | Listar matches activos. |
| `POST` | `/api/sessions` | Proponer sesión. |
| `PATCH` | `/api/sessions/:id` | Aceptar, cancelar o proponer cambio. |
| `GET` | `/api/sessions?userId=` | Listar sesiones del usuario (Perfil). |

### Ejemplo: registrar swipe

```json
POST /api/swipes
{
  "actorId": "00000000-0000-4000-8000-000000000001",
  "targetId": "00000000-0000-4000-8000-000000000002",
  "decision": "like"
}
```

```json
{
  "swipe": { "id": "swipe-10", "decision": "like" },
  "isMatch": true,
  "match": {
    "id": "match-3",
    "score": 92,
    "reasons": ["Cálculo I", "Disponibilidad por la tarde"]
  }
}
```

Errores mínimos: `400` para datos inválidos, `404` para recursos inexistentes y `409` para acciones duplicadas.

#### Peticiones de escritura

`POST /api/posts`

```json
{
  "authorId": "00000000-0000-4000-8000-000000000001",
  "subjectId": "00000000-0000-4000-8000-000000000101",
  "type": "foto",
  "title": "Resumen de integrales",
  "description": "Ejercicio resuelto",
  "tags": ["integrales"],
  "mediaUrl": "https://example.com/recurso.jpg"
}
```

Requiere `authorId`, `subjectId`, `type`, `title` y `mediaUrl`. Devuelve `201`
con `{ "post": ... }`.

`PATCH /api/users/:id`

```json
{
  "name": "Sofía Martínez",
  "role": "estudiante",
  "goals": ["Aprobar Cálculo I"],
  "availability": ["tarde", "sabado"],
  "subjects": [
    {
      "id": "00000000-0000-4000-8000-000000000101",
      "level": 2,
      "isTeaching": false
    }
  ]
}
```

Todos los campos son opcionales, pero debe enviarse al menos uno. Si se envía
`subjects`, reemplaza la selección actual y requiere al menos una materia.

`POST /api/sessions`

```json
{
  "matchId": "00000000-0000-4000-8000-000000000301",
  "proposerId": "00000000-0000-4000-8000-000000000001",
  "scheduledAt": "2026-07-18T16:00:00Z",
  "durationMinutes": 60,
  "modality": "virtual"
}
```

Devuelve `201`; el estado inicial siempre es `pendiente`.

`PATCH /api/sessions/:id` acepta `status`, `scheduledAt`, `durationMinutes`,
`modality` y `changeNote`. Si cambia horario, duración, modalidad o nota sin
enviar `status`, la sesión pasa a `cambio_propuesto`.

### 8.2 Supabase (cliente / RPC)

Cuando la UI deje de usar mocks, el frontend puede:

- leer `subjects`, `profiles`, `posts` con el cliente `@supabase/supabase-js`;
- invocar `record_swipe` para el flujo Match;
- insertar/actualizar `study_sessions` para agendar.

Variables: ver [`docs/INTEGRATIONS.md`](./docs/INTEGRATIONS.md).

### 8.3 Estado de integración actual

| Capa | Estado |
| --- | --- |
| UI Next.js (`/home`, `/classes`, `/create`, `/match`, `/profile`) | Implementada con datos mock en `src/data/` |
| Esquema + seed Supabase | Listos en `supabase/` |
| API Express | Lista en `backend/` |
| Conexión UI → Supabase o Express | Pendiente (mock activo en demo) |

## 9. Datos semilla para la demo

Definidos en [`supabase/seed.sql`](./supabase/seed.sql) (UUIDs fijos):

- Usuario activo: Sofía Martínez (`...0001`), estudiante de Ingeniería; materias Cálculo e Inglés.
- 4 perfiles adicionales: María (match mutuo al recibir like de Sofía), Carlos, Lucía y Diego.
- 5 clases: Cálculo, Inglés, Física, Programación, Diseño.
- 6 publicaciones: al menos 1 por cada clase visible en categorías.
- 1 publicación guardada por Sofía para poblar la pestaña Guardados.
- 1 swipe previo María → Sofía (`like`) para producir match mutuo en la demo.
- 1 match seed Sofía ↔ Carlos, con 1 sesión `pendiente` y 1 `aceptada`.

La API Express consume directamente este seed y sus UUIDs.

## 10. Criterios de demostración

La demo termina con este recorrido, sin errores bloqueantes:

1. Sofía entra al feed, filtra `Cálculo` y busca un recurso.
2. Crea una publicación de ejemplo desde `+` y la ve en Inicio.
3. Entra a Match, omite un perfil y da `like` a María.
4. Se muestra el match mutuo con su razón de compatibilidad.
5. Agenda una sesión virtual de 60 minutos.
6. Consulta la sesión en Perfil.

URL pública de referencia: https://study-match-mp4cusjeq-hugo-arias-projects.vercel.app

## 11. Decisiones técnicas

| Tema | Decisión |
| --- | --- |
| Frontend | Next.js + TypeScript; Tailwind CSS, `lucide-react` y `motion` |
| Backend API | Node.js + Express en `backend/` (contrato HTTP del MVP) |
| Persistencia canónica | Supabase (PostgreSQL) en `supabase/migrations` + `supabase/seed.sql` |
| Auth / Storage | Preparados en migración (RLS, buckets `avatars`/`posts`); Auth de producción fuera del alcance de la demo |
| Arrays / materias | En Supabase: `goals`/`tags` como `text[]`; materias vía `profile_subjects`; `availability` en JSONB |
| Auth MVP en Express | Sin auth de producción; el cliente envía UUID de perfil en query o body |
| Despliegue | Vercel (responsable full stack); demo ya publicada |
| Medios | URLs de ejemplo en seed; Storage para implementación posterior |
| Validación backend Express | `cd backend && npm run dev` |
| Integraciones | [`docs/INTEGRATIONS.md`](./docs/INTEGRATIONS.md) |

### Identificadores

Supabase y Express usan los mismos UUIDs fijos del seed (p. ej. Sofía
`00000000-0000-4000-8000-000000000001`).
