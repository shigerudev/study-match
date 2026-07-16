-- StudyMatch MVP — datos semilla (ejecutar después de schema.sql)

truncate table sessions, matches, swipes, posts, users, subjects restart identity cascade;

insert into subjects (id, name, color) values
  ('subject-calculo', 'Cálculo', '#2563EB'),
  ('subject-ingles', 'Inglés', '#059669'),
  ('subject-fisica', 'Física', '#D97706'),
  ('subject-programacion', 'Programación', '#7C3AED'),
  ('subject-diseno', 'Diseño', '#DB2777');

-- Sofía: usuario activo de la demo
insert into users (id, name, avatar_url, role, bio, career, subjects, goals, availability, level) values
(
  'user-sofia',
  'Sofía Ramírez',
  'https://i.pravatar.cc/150?u=sofia',
  'estudiante',
  'Estudiante de Ingeniería. Busco apoyo en Cálculo I y practicar inglés.',
  'Ingeniería',
  '["Cálculo I", "Inglés"]'::jsonb,
  '["aprobar parcial", "practicar speaking"]'::jsonb,
  '[{"day":"lun","slot":"tarde"},{"day":"mie","slot":"tarde"},{"day":"vie","slot":"manana"}]'::jsonb,
  'intermedio'
),
(
  'user-maria',
  'María López',
  'https://i.pravatar.cc/150?u=maria',
  'ambos',
  'Mentora de Cálculo y estudiante de inglés avanzado.',
  'Matemáticas',
  '["Cálculo I", "Inglés"]'::jsonb,
  '["enseñar calculo", "practicar speaking"]'::jsonb,
  '[{"day":"lun","slot":"tarde"},{"day":"jue","slot":"tarde"}]'::jsonb,
  'avanzado'
),
(
  'user-diego',
  'Diego Torres',
  'https://i.pravatar.cc/150?u=diego',
  'estudiante',
  'Enfocado en Física y Programación.',
  'Ingeniería',
  '["Física", "Programación"]'::jsonb,
  '["resolver tareas"]'::jsonb,
  '[{"day":"mar","slot":"noche"}]'::jsonb,
  'basico'
),
(
  'user-ana',
  'Ana Ruiz',
  'https://i.pravatar.cc/150?u=ana',
  'profesor',
  'Profesora de Diseño y UX.',
  'Diseño',
  '["Diseño"]'::jsonb,
  '["portafolio"]'::jsonb,
  '[{"day":"sab","slot":"manana"}]'::jsonb,
  'avanzado'
),
(
  'user-luis',
  'Luis Méndez',
  'https://i.pravatar.cc/150?u=luis',
  'estudiante',
  'Quiere mejorar Programación y Cálculo.',
  'Sistemas',
  '["Programación", "Cálculo I"]'::jsonb,
  '["aprobar parcial"]'::jsonb,
  '[{"day":"vie","slot":"tarde"}]'::jsonb,
  'intermedio'
);

insert into posts (id, author_id, subject_id, type, title, description, tags, media_url, created_at) values
(
  'post-1',
  'user-maria',
  'subject-calculo',
  'photo',
  'Derivadas en 5 minutos',
  'Resumen visual de la regla de la cadena.',
  '["derivadas","calculo-i"]'::jsonb,
  'https://picsum.photos/seed/calculo/800/600',
  now() - interval '6 hours'
),
(
  'post-2',
  'user-sofia',
  'subject-ingles',
  'video',
  'Phrasal verbs comunes',
  'Clip corto con ejemplos de uso.',
  '["ingles","vocabulario"]'::jsonb,
  'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
  now() - interval '5 hours'
),
(
  'post-3',
  'user-diego',
  'subject-fisica',
  'photo',
  'Leyes de Newton',
  'Mapa mental de las tres leyes.',
  '["fisica","newton"]'::jsonb,
  'https://picsum.photos/seed/fisica/800/600',
  now() - interval '4 hours'
),
(
  'post-4',
  'user-luis',
  'subject-programacion',
  'video',
  'Bucles en JavaScript',
  'for, while y forEach con ejemplos.',
  '["js","bucles"]'::jsonb,
  'https://samplelib.com/lib/preview/mp4/sample-10s.mp4',
  now() - interval '3 hours'
),
(
  'post-5',
  'user-ana',
  'subject-diseno',
  'photo',
  'Jerarquía tipográfica',
  'Ejemplo de escala tipográfica para UI.',
  '["ui","tipografia"]'::jsonb,
  'https://picsum.photos/seed/diseno/800/600',
  now() - interval '2 hours'
),
(
  'post-6',
  'user-maria',
  'subject-calculo',
  'photo',
  'Límites: trucos rápidos',
  'Tres casos frecuentes en exámenes.',
  '["limites","examen"]'::jsonb,
  'https://picsum.photos/seed/limites/800/600',
  now() - interval '1 hour'
);

-- María ya dio like a Sofía → al dar like Sofía→María se crea match mutuo
insert into swipes (id, actor_id, target_id, decision, created_at) values
  ('swipe-seed-1', 'user-maria', 'user-sofia', 'like', now() - interval '1 day');

-- Match previo + sesiones para poblar Perfil (Sofía ↔ Luis)
insert into matches (id, user_a_id, user_b_id, score, reasons, status, created_at) values
(
  'match-seed-1',
  'user-luis',
  'user-sofia',
  78,
  '["Cálculo I", "Objetivo: aprobar parcial"]'::jsonb,
  'activo',
  now() - interval '3 days'
);

insert into swipes (id, actor_id, target_id, decision, created_at) values
  ('swipe-seed-2', 'user-sofia', 'user-luis', 'like', now() - interval '3 days'),
  ('swipe-seed-3', 'user-luis', 'user-sofia', 'like', now() - interval '3 days');

insert into sessions (id, match_id, proposer_id, scheduled_at, duration_minutes, modality, status) values
(
  'session-pendiente-1',
  'match-seed-1',
  'user-luis',
  now() + interval '2 days',
  30,
  'virtual',
  'pendiente'
),
(
  'session-aceptada-1',
  'match-seed-1',
  'user-sofia',
  now() + interval '5 days',
  60,
  'presencial',
  'aceptada'
);
