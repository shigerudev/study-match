# Reglas de desarrollo — StudyMatch

## 1. Desarrollo guiado por especificaciones

Este repositorio se desarrolla con un enfoque **Software/Spec-Driven Development**: antes de implementar una funcionalidad, se debe comprobar que existe en [`SPECS.md`](./SPECS.md) o actualizar la especificación y obtener acuerdo del equipo.

- `SPECS.md` es la fuente de verdad del comportamiento del MVP.
- Cada cambio debe mantener alineados interfaz, API, datos de ejemplo y criterios de aceptación.
- No se agregan funcionalidades fuera del MVP sin anotarlas primero como propuesta o fuera de alcance.
- Si una decisión no está definida, se documenta como supuesto en la especificación antes de codificarla.

## 2. Flujo de trabajo

1. Leer `SPECS.md` y localizar la historia de usuario afectada.
2. Definir el cambio mínimo que cumple sus criterios de aceptación.
3. Implementar en una rama o commit enfocado.
4. Validar el flujo manual y, cuando corresponda, con pruebas automatizadas.
5. Actualizar la especificación si cambió el comportamiento, modelo de datos o contrato de API.

## 3. Uso de skills

- Cuando una tarea coincida con una skill disponible en el entorno, se debe usar automáticamente esa skill y seguir sus instrucciones.
- Ejemplos: diseño/edición de imágenes → `imagegen`; documentos → `documents`; hojas de cálculo → `spreadsheets`; PDF → `pdf`; GitHub/PR/CI → skills de GitHub.
- No se inventan skills ni se asume que una skill está instalada. Si hace falta una no disponible, se informa al equipo y se propone instalarla.
- Las skills complementan estas reglas; no reemplazan la especificación del producto.

## 4. Criterios de calidad

- Priorizar el flujo demo sobre funcionalidades secundarias.
- La interfaz debe ser usable en móvil primero, con estados de carga, vacío y error razonables.
- Mantener accesibilidad básica: contraste legible, controles con texto o etiqueta y acciones de swipe con botones alternativos.
- No subir secretos, tokens, claves ni información personal real.
- Usar datos ficticios para la demo.

## 5. Convenciones del repositorio

- Documentación en español.
- Commits pequeños y descriptivos, en imperativo: `Add match swipe endpoint`.
- Formatear, validar tipos y ejecutar pruebas relevantes antes de publicar cambios.
- Todo endpoint nuevo debe documentarse en `SPECS.md` con petición, respuesta y errores esperados.

## 6. Definición de terminado

Una historia está terminada cuando:

- cumple todos sus criterios de aceptación;
- funciona con datos semilla;
- tiene manejo de error o estado vacío necesario para la demo;
- su API e interfaz están integradas o el mock está claramente señalado;
- `SPECS.md` refleja el resultado final.
