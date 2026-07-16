# StudyMatch

**Aprende acompañado.** StudyMatch conecta estudiantes y profesores según sus intereses, objetivos de aprendizaje y disponibilidad, para que puedan encontrar compañeros de estudio y agendar sesiones fácilmente.

## El problema

Encontrar a la persona correcta para estudiar, resolver dudas o recibir apoyo académico suele depender de grupos dispersos y mensajes sin contexto. Esto hace difícil coincidir en materia, nivel y horario.

## Nuestra solución

StudyMatch propone recomendaciones de perfiles compatibles y un flujo rápido para solicitar, aceptar y organizar sesiones de estudio. La experiencia principal será un feed de contenido académico inspirado en la jerarquía de navegación de YouTube: descubrimiento por clases, publicaciones educativas y acceso inmediato a Match.

## Funcionalidades del MVP

- **Perfiles de estudiantes y profesores** con rol, materias, nivel, intereses y disponibilidad.
- **Matching por afinidad** considerando materia, objetivo, nivel y horarios compatibles.
- **Compatibilidad explicable**, por ejemplo: “Ambos preparan Cálculo I y tienen disponibilidad por la tarde”.
- **Solicitud y agenda de sesiones** de 30 o 60 minutos, virtuales o presenciales.
- **Feed de videos educativos** clasificados por materia, tema y nivel.
- **Publicaciones académicas**: fotos, videos cortos y una descripción opcional; el usuario puede compartir apuntes, preguntas, explicaciones o recursos.
- **Panel personal** con próximos encuentros, solicitudes y videos guardados.

## Navegación principal

La barra inferior tendrá cinco destinos para mantener las acciones esenciales siempre visibles:

| Opción | Propósito |
| --- | --- |
| **Inicio** | Feed de publicaciones educativas: videos cortos, fotos, apuntes y recursos de la comunidad. |
| **Clases** | Explorar el feed por categorías académicas, por ejemplo: Cálculo, Inglés, Física, Programación y Diseño. |
| **Crear (`+`)** | Crear una publicación de foto o video corto; añadir título, clase, descripción y etiquetas. |
| **Match** | Descubrir compañeros de estudio mediante tarjetas deslizables. |
| **Perfil** | Consultar y editar información personal, materias, disponibilidad, publicaciones, sesiones y videos guardados. |

En la parte superior de Inicio habrá una **búsqueda global** para encontrar clases, temas, publicaciones o usuarios. Debajo se mostrará un carrusel horizontal de categorías de clases, similar al selector de categorías de la referencia visual.

## Especificación de pantallas

### Inicio: feed académico

- Campo de búsqueda fijo en la parte superior.
- Categorías horizontales: `Todo`, `Cálculo`, `Inglés`, `Física`, `Programación`, `Diseño`.
- Tarjetas de publicación con autor, clase, foto o video corto, título, descripción breve, reacciones y menú de opciones.
- Los videos cortos se reproducen dentro del feed; para el MVP pueden ser recursos de ejemplo o enlaces simulados.

### Crear publicación

- Selector de tipo: **Foto** o **Video corto**.
- Previsualización del archivo seleccionado.
- Campos: título, descripción, clase y etiquetas.
- Botón **Publicar**.
- Para la demo, la carga puede simularse con contenido local o una URL de ejemplo.

### Match: selección tipo Tinder

- Una tarjeta a la vez con foto, nombre, rol, materias, objetivo de estudio, disponibilidad y porcentaje de compatibilidad.
- Deslizar a la **izquierda** para omitir; deslizar a la **derecha** para mostrar interés.
- Botones alternativos de `✕` y `♥` para que la acción funcione también sin gestos.
- Al haber interés mutuo, mostrar “¡Hicieron match!” y un botón **Agendar sesión**.
- Filtros opcionales para materia, nivel, modalidad y horario.

### Perfil

- Cabecera con avatar, nombre, carrera/rol y una breve biografía.
- Materias que enseña o estudia, intereses y disponibilidad.
- Pestañas: **Publicaciones**, **Sesiones** y **Guardados**.
- Acción **Editar perfil** para actualizar los datos que alimentan el matching.

## Flujo principal

1. La persona crea su perfil y selecciona sus materias, intereses y horarios.
2. Explora publicaciones o busca una clase desde Inicio.
3. Puede crear una foto o video corto educativo desde el botón `+`.
4. En Match desliza perfiles para indicar interés o para omitirlos.
5. Cuando hay coincidencia, propone una sesión; la otra persona acepta o modifica el horario.
6. Ambos consultan su próxima sesión y recursos guardados desde Perfil.

## Roles en el equipo

| Persona | Responsabilidad principal | Entregables |
| --- | --- | --- |
| **Emily — Diseño** | UX/UI y contenido visual | Flujo en Figma, diseño de Inicio, Crear, Match y Perfil; paleta, componentes, avatares, miniaturas y datos ficticios para demo. |
| **Antonio — Back end** | API, base de datos y lógica | Modelos de usuarios, publicaciones, clases, matches y sesiones; endpoints para feed, perfil, swipe, match y agenda; datos semilla. |
| **Hugo — Full stack** | Frontend, integración y demo | App responsive, navegación inferior, búsqueda/categorías, feed, pantalla de creación, Match tipo Tinder y conexión con API. |

## Alcance de la hackatón

Priorizamos una experiencia de demostración completa: crear perfil, explorar un feed por clases, crear una publicación simulada, recibir matches, agendar una sesión y descubrir un video. Las notificaciones en tiempo real, videollamadas, moderación avanzada, carga real de archivos y pagos quedan fuera del MVP inicial.

## Documentación del proyecto

- [Especificación funcional y técnica del MVP](./SPECS.md)
- [Reglas de desarrollo guiado por especificaciones](./RULES.md)
- [Instrucciones para agentes](./AGENTS.md)
- [Configuración de MCP, API y despliegue](./docs/INTEGRATIONS.md)

## Tecnologías

| Capa | Stack |
| --- | --- |
| Frontend | Next.js + TypeScript |
| Backend API | Node.js + Express (`backend/`) |
| Base de datos | Supabase (PostgreSQL) |
| Esquema / seed | `backend/sql/` + `npm run db:setup` |
| Despliegue | Vercel (responsable full stack) |

## Demo

La versión actual del MVP está desplegada en Vercel:

[Abrir StudyMatch](https://study-match-mp4cusjeq-hugo-arias-projects.vercel.app)
