-- Datos ficticios para el recorrido de demo definido en SPECS.md.
-- Se pueden aplicar después de la migración desde el SQL Editor o Supabase CLI.

insert into public.subjects (id, name, slug, color) values
  ('00000000-0000-4000-8000-000000000101', 'Cálculo', 'calculo', '#7C3AED'),
  ('00000000-0000-4000-8000-000000000102', 'Inglés', 'ingles', '#2563EB'),
  ('00000000-0000-4000-8000-000000000103', 'Física', 'fisica', '#0891B2'),
  ('00000000-0000-4000-8000-000000000104', 'Programación', 'programacion', '#059669'),
  ('00000000-0000-4000-8000-000000000105', 'Diseño', 'diseno', '#DB2777')
on conflict (id) do update set name = excluded.name, slug = excluded.slug, color = excluded.color;

insert into public.profiles (id, name, avatar_url, role, bio, career, goals, availability) values
  ('00000000-0000-4000-8000-000000000001', 'Sofía Martínez', 'https://i.pravatar.cc/300?img=47', 'estudiante', 'Estudio Ingeniería y aprendo mejor resolviendo ejercicios en equipo.', 'Ingeniería en Sistemas', array['Aprobar Cálculo I', 'Practicar inglés'], '["tarde", "sabado"]'),
  ('00000000-0000-4000-8000-000000000002', 'María López', 'https://i.pravatar.cc/300?img=32', 'ambos', 'Mentora de cálculo. Me gustan las sesiones cortas con ejercicios prácticos.', 'Ingeniería Industrial', array['Aprobar Cálculo I', 'Enseñar cálculo'], '["tarde", "martes"]'),
  ('00000000-0000-4000-8000-000000000003', 'Carlos Reyes', 'https://i.pravatar.cc/300?img=12', 'profesor', 'Profesor de física y programación para principiantes.', 'Docencia Universitaria', array['Enseñar física', 'Crear comunidad'], '["manana", "jueves"]'),
  ('00000000-0000-4000-8000-000000000004', 'Lucía Pérez', 'https://i.pravatar.cc/300?img=44', 'estudiante', 'Busco compañeros para practicar conversación en inglés.', 'Comunicación', array['Practicar inglés', 'Hablar con fluidez'], '["noche", "viernes"]'),
  ('00000000-0000-4000-8000-000000000005', 'Diego Ramos', 'https://i.pravatar.cc/300?img=68', 'ambos', 'Diseñador y desarrollador; comparto recursos visuales.', 'Diseño Digital', array['Aprender programación', 'Compartir recursos'], '["tarde", "domingo"]')
on conflict (id) do update set
  name = excluded.name, avatar_url = excluded.avatar_url, role = excluded.role, bio = excluded.bio,
  career = excluded.career, goals = excluded.goals, availability = excluded.availability;

insert into public.profile_subjects (profile_id, subject_id, level, is_teaching) values
  ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000101', 2, false),
  ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000102', 3, false),
  ('00000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000101', 3, true),
  ('00000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000104', 3, false),
  ('00000000-0000-4000-8000-000000000003', '00000000-0000-4000-8000-000000000103', 5, true),
  ('00000000-0000-4000-8000-000000000003', '00000000-0000-4000-8000-000000000104', 4, true),
  ('00000000-0000-4000-8000-000000000004', '00000000-0000-4000-8000-000000000102', 3, false),
  ('00000000-0000-4000-8000-000000000005', '00000000-0000-4000-8000-000000000104', 3, false),
  ('00000000-0000-4000-8000-000000000005', '00000000-0000-4000-8000-000000000105', 4, true)
on conflict (profile_id, subject_id) do update set level = excluded.level, is_teaching = excluded.is_teaching;

insert into public.posts (id, author_id, subject_id, type, title, description, tags, media_url, created_at) values
  ('00000000-0000-4000-8000-000000000201', '00000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000101', 'video', 'Derivadas en 60 segundos', 'Regla de la potencia explicada con un ejemplo rápido.', array['derivadas', 'calculo-1'], 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=900&q=80', '2026-07-16 14:00:00+00'),
  ('00000000-0000-4000-8000-000000000202', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000102', 'foto', 'Mis conectores favoritos', 'Una guía visual para enlazar ideas en inglés.', array['grammar', 'writing'], 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=900&q=80', '2026-07-16 13:00:00+00'),
  ('00000000-0000-4000-8000-000000000203', '00000000-0000-4000-8000-000000000003', '00000000-0000-4000-8000-000000000103', 'video', 'Vectores sin fórmulas largas', 'Cómo visualizar dirección, magnitud y sentido.', array['vectores', 'mecanica'], 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=900&q=80', '2026-07-16 12:00:00+00'),
  ('00000000-0000-4000-8000-000000000204', '00000000-0000-4000-8000-000000000005', '00000000-0000-4000-8000-000000000104', 'foto', 'Mapa mental de estructuras de datos', 'Una chuleta para elegir la estructura adecuada.', array['algoritmos', 'estructuras'], 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80', '2026-07-16 11:00:00+00'),
  ('00000000-0000-4000-8000-000000000205', '00000000-0000-4000-8000-000000000005', '00000000-0000-4000-8000-000000000105', 'foto', 'Jerarquía visual para principiantes', 'Tres ajustes que hacen más clara cualquier composición.', array['tipografia', 'ui'], 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=900&q=80', '2026-07-16 10:00:00+00'),
  ('00000000-0000-4000-8000-000000000206', '00000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000101', 'foto', 'Límites: método paso a paso', 'Ejercicio resuelto para practicar antes del parcial.', array['limites', 'ejercicios'], 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=900&q=80', '2026-07-16 09:00:00+00')
on conflict (id) do update set title = excluded.title, description = excluded.description, tags = excluded.tags, media_url = excluded.media_url, created_at = excluded.created_at;

-- María ya indicó interés en Sofía; el like de Sofía hacia María crea el match en la demo.
insert into public.swipes (actor_id, target_id, decision) values
  ('00000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000001', 'like')
on conflict (actor_id, target_id) do update set decision = excluded.decision;

insert into public.matches (id, user_a_id, user_b_id, score, reasons, status) values
  ('00000000-0000-4000-8000-000000000301', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000003', 40, array['Interés académico complementario'], 'activo')
on conflict (user_a_id, user_b_id) do update set score = excluded.score, reasons = excluded.reasons, status = excluded.status;

insert into public.study_sessions (id, match_id, proposer_id, scheduled_at, duration_minutes, modality, status) values
  ('00000000-0000-4000-8000-000000000401', '00000000-0000-4000-8000-000000000301', '00000000-0000-4000-8000-000000000001', '2026-07-18 16:00:00+00', 60, 'virtual', 'pendiente'),
  ('00000000-0000-4000-8000-000000000402', '00000000-0000-4000-8000-000000000301', '00000000-0000-4000-8000-000000000003', '2026-07-20 16:00:00+00', 30, 'virtual', 'aceptada')
on conflict (id) do update set scheduled_at = excluded.scheduled_at, duration_minutes = excluded.duration_minutes, modality = excluded.modality, status = excluded.status;
