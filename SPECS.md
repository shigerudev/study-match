# Especificación del MVP — StudyMatch

**Versión:** 1.0  
**Estado:** lista para implementación  
**Objetivo de demo:** una persona descubre contenido por clase, publica un recurso, realiza un match y agenda una sesión.

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

La navegación inferior tiene cinco destinos:

| Destino | Ruta sugerida | Contenido |
| --- | --- | --- |
| Inicio | `/home` | Feed, búsqueda y categorías de clases. |
| Clases | `/classes` | Exploración de todas las clases y sus publicaciones. |
| Crear (`+`) | `/create` | Formulario para foto o video corto. |
| Match | `/match` | Tarjetas de perfiles compatibles. |
| Perfil | `/profile` | Información, publicaciones, sesiones y guardados. |

Inicio contiene una barra de búsqueda superior y categorías horizontales: `Todo`, `Cálculo`, `Inglés`, `Física`, `Programación` y `Diseño`.

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

El valor es explicable y puede utilizar datos semilla. Fórmula sugerida sobre 100:

| Señal | Puntos máximos |
| --- | ---: |
| Materias compartidas | 40 |
| Objetivo compatible | 20 |
| Coincidencia de disponibilidad | 25 |
| Nivel compatible | 15 |

La tarjeta debe mostrar la puntuación y una razón, por ejemplo: “Coinciden en Cálculo I y tienen disponibilidad por la tarde”.

### Estados

| Recurso | Estados |
| --- | --- |
| Interés | `pendiente`, `omitido`, `aceptado` |
| Match | `activo`, `archivado` |
| Sesión | `pendiente`, `aceptada`, `cambio_propuesto`, `cancelada`, `completada` |
| Publicación | `publicada`, `eliminada` |

## 7. Modelo de datos mínimo

```text
User
  id, name, avatarUrl, role, bio, career, subjects[], goals[], availability[]

Subject
  id, name, color

Post
  id, authorId, subjectId, type(photo|video), title, description, tags[], mediaUrl, createdAt

Swipe
  id, actorId, targetId, decision(skip|like), createdAt

Match
  id, userAId, userBId, score, reasons[], status, createdAt

Session
  id, matchId, proposerId, scheduledAt, durationMinutes, modality, status
```

## 8. Contrato de API sugerido

| Método | Ruta | Acción |
| --- | --- | --- |
| `GET` | `/api/posts?subject=&q=` | Obtener feed filtrado. |
| `POST` | `/api/posts` | Crear publicación. |
| `GET` | `/api/subjects` | Listar clases. |
| `GET` | `/api/users/:id` | Consultar perfil. |
| `PATCH` | `/api/users/:id` | Editar perfil. |
| `GET` | `/api/matches/discover?userId=` | Obtener tarjeta siguiente. |
| `POST` | `/api/swipes` | Registrar `skip` o `like`; devuelve match si aplica. |
| `GET` | `/api/matches?userId=` | Listar matches activos. |
| `POST` | `/api/sessions` | Proponer sesión. |
| `PATCH` | `/api/sessions/:id` | Aceptar, cancelar o proponer cambio. |

### Ejemplo: registrar swipe

```json
POST /api/swipes
{
  "actorId": "user-1",
  "targetId": "user-2",
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

## 9. Datos semilla para la demo

- 1 usuario activo: Sofía, estudiante de Ingeniería, interesada en Cálculo I e Inglés.
- 4 perfiles de Match con disponibilidad y objetivos distintos; uno debe producir match mutuo.
- 6 publicaciones: al menos 1 por cada clase visible en categorías.
- 1 sesión pendiente y 1 sesión aceptada para poblar Perfil.

## 10. Criterios de demostración

La demo termina con este recorrido, sin errores bloqueantes:

1. Sofía entra al feed, filtra `Cálculo` y busca un recurso.
2. Crea una publicación de ejemplo desde `+` y la ve en Inicio.
3. Entra a Match, omite un perfil y da `like` a María.
4. Se muestra el match mutuo con su razón de compatibilidad.
5. Agenda una sesión virtual de 60 minutos.
6. Consulta la sesión en Perfil.

## 11. Decisiones pendientes

- Framework de frontend y backend.
- Persistencia: datos en memoria/JSON para demo o base de datos ligera.
- Fuente de medios de ejemplo y estrategia de carga real posterior.
