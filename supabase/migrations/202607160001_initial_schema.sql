-- StudyMatch MVP: esquema inicial, seguridad y funciones de dominio.
-- Ejecutar en un proyecto nuevo de Supabase antes de supabase/seed.sql.

create extension if not exists pgcrypto;

create type public.profile_role as enum ('estudiante', 'profesor', 'ambos');
create type public.post_type as enum ('foto', 'video');
create type public.post_status as enum ('publicada', 'eliminada');
create type public.swipe_decision as enum ('skip', 'like');
create type public.match_status as enum ('activo', 'archivado');
create type public.session_modality as enum ('virtual', 'presencial');
create type public.session_status as enum ('pendiente', 'aceptada', 'cambio_propuesto', 'cancelada', 'completada');

create table public.subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  color text not null default '#6366F1' check (color ~ '^#[0-9A-Fa-f]{6}$'),
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete set null,
  name text not null check (char_length(trim(name)) between 2 and 80),
  avatar_url text,
  role public.profile_role not null default 'estudiante',
  bio text not null default '' check (char_length(bio) <= 280),
  career text not null default '' check (char_length(career) <= 120),
  goals text[] not null default '{}',
  availability jsonb not null default '[]'::jsonb check (jsonb_typeof(availability) = 'array'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profile_subjects (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  level smallint not null default 3 check (level between 1 and 5),
  is_teaching boolean not null default false,
  primary key (profile_id, subject_id)
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete restrict,
  type public.post_type not null,
  title text not null check (char_length(trim(title)) between 3 and 140),
  description text not null default '' check (char_length(description) <= 1000),
  tags text[] not null default '{}',
  media_url text not null,
  status public.post_status not null default 'publicada',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.saved_posts (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  post_id uuid not null references public.posts(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (profile_id, post_id)
);

create table public.swipes (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references public.profiles(id) on delete cascade,
  target_id uuid not null references public.profiles(id) on delete cascade,
  decision public.swipe_decision not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (actor_id, target_id),
  check (actor_id <> target_id)
);

create table public.matches (
  id uuid primary key default gen_random_uuid(),
  user_a_id uuid not null references public.profiles(id) on delete cascade,
  user_b_id uuid not null references public.profiles(id) on delete cascade,
  score smallint not null check (score between 0 and 100),
  reasons text[] not null default '{}',
  status public.match_status not null default 'activo',
  created_at timestamptz not null default now(),
  unique (user_a_id, user_b_id),
  check (user_a_id < user_b_id)
);

create table public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  proposer_id uuid not null references public.profiles(id) on delete restrict,
  scheduled_at timestamptz not null,
  duration_minutes smallint not null check (duration_minutes in (30, 60)),
  modality public.session_modality not null,
  status public.session_status not null default 'pendiente',
  change_note text check (char_length(change_note) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index posts_subject_created_idx on public.posts (subject_id, created_at desc) where status = 'publicada';
create index posts_author_created_idx on public.posts (author_id, created_at desc);
create index posts_tags_idx on public.posts using gin (tags);
create index profile_subjects_subject_idx on public.profile_subjects (subject_id, profile_id);
create index swipes_target_decision_idx on public.swipes (target_id, decision);
create index sessions_match_scheduled_idx on public.study_sessions (match_id, scheduled_at);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger posts_set_updated_at before update on public.posts
  for each row execute function public.set_updated_at();
create trigger swipes_set_updated_at before update on public.swipes
  for each row execute function public.set_updated_at();
create trigger sessions_set_updated_at before update on public.study_sessions
  for each row execute function public.set_updated_at();

-- Permite ligar cada usuario autenticado a un perfil sin exponer auth.users.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (auth_user_id, name, avatar_url)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'full_name', ''), split_part(new.email, '@', 1), 'Estudiante'),
    nullif(new.raw_user_meta_data ->> 'avatar_url', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.current_profile_id()
returns uuid
language sql
stable
security definer set search_path = public
as $$
  select id from public.profiles where auth_user_id = auth.uid()
$$;

-- Puntuación explicable conforme a SPECS.md: materias 40, objetivos 20,
-- disponibilidad 25 y nivel 15. La disponibilidad se modela como bloques JSON.
create or replace function public.match_score(p_actor_id uuid, p_target_id uuid)
returns table(score smallint, reasons text[])
language plpgsql
stable
security definer set search_path = public
as $$
declare
  shared_subjects text[];
  shared_goals text[];
  shared_availability boolean;
  level_compatible boolean;
  calculated_score integer := 0;
  calculated_reasons text[] := '{}';
begin
  select coalesce(array_agg(s.name order by s.name), '{}')
  into shared_subjects
  from public.profile_subjects a
  join public.profile_subjects b on b.subject_id = a.subject_id
  join public.subjects s on s.id = a.subject_id
  where a.profile_id = p_actor_id and b.profile_id = p_target_id;

  select coalesce(array_agg(distinct goal), '{}')
  into shared_goals
  from public.profiles a
  join public.profiles b on b.id = p_target_id
  cross join lateral unnest(a.goals) goal
  where a.id = p_actor_id and goal = any(b.goals);

  select exists (
    select 1
    from public.profiles a
    join public.profiles b on b.id = p_target_id
    cross join lateral jsonb_array_elements_text(a.availability) a_slot
    cross join lateral jsonb_array_elements_text(b.availability) b_slot
    where a.id = p_actor_id and a_slot = b_slot
  ) into shared_availability;

  select exists (
    select 1
    from public.profile_subjects a
    join public.profile_subjects b on b.subject_id = a.subject_id
    where a.profile_id = p_actor_id
      and b.profile_id = p_target_id
      and abs(a.level - b.level) <= 1
  ) into level_compatible;

  if cardinality(shared_subjects) > 0 then
    calculated_score := calculated_score + 40;
    calculated_reasons := calculated_reasons || ('Coinciden en ' || array_to_string(shared_subjects, ', '));
  end if;
  if cardinality(shared_goals) > 0 then
    calculated_score := calculated_score + 20;
    calculated_reasons := calculated_reasons || 'Tienen un objetivo de estudio en común';
  end if;
  if shared_availability then
    calculated_score := calculated_score + 25;
    calculated_reasons := calculated_reasons || 'Comparten disponibilidad';
  end if;
  if level_compatible then
    calculated_score := calculated_score + 15;
    calculated_reasons := calculated_reasons || 'Sus niveles son compatibles';
  end if;

  return query select calculated_score::smallint, calculated_reasons;
end;
$$;

-- RPC para el flujo de swipe. Evita que el cliente falsifique score o reasons.
create or replace function public.record_swipe(p_target_id uuid, p_decision public.swipe_decision)
returns table(swipe_id uuid, is_match boolean, match_id uuid, score smallint, reasons text[])
language plpgsql
security definer set search_path = public
as $$
declare
  actor uuid := public.current_profile_id();
  pair_a uuid;
  pair_b uuid;
  new_match_id uuid;
  calculated_score smallint;
  calculated_reasons text[];
  reciprocal_like boolean;
  result_swipe_id uuid;
begin
  if actor is null then
    raise exception 'Perfil autenticado no encontrado' using errcode = '42501';
  end if;
  if actor = p_target_id or not exists (select 1 from public.profiles where id = p_target_id) then
    raise exception 'Perfil objetivo inválido' using errcode = '22023';
  end if;

  insert into public.swipes (actor_id, target_id, decision)
  values (actor, p_target_id, p_decision)
  on conflict (actor_id, target_id) do update
    set decision = excluded.decision, updated_at = now()
  returning id into result_swipe_id;

  reciprocal_like := p_decision = 'like' and exists (
    select 1 from public.swipes
    where actor_id = p_target_id and target_id = actor and decision = 'like'
  );

  if reciprocal_like then
    pair_a := least(actor, p_target_id);
    pair_b := greatest(actor, p_target_id);
    select ms.score, ms.reasons into calculated_score, calculated_reasons
    from public.match_score(actor, p_target_id) ms;

    insert into public.matches (user_a_id, user_b_id, score, reasons)
    values (pair_a, pair_b, calculated_score, calculated_reasons)
    on conflict (user_a_id, user_b_id) do update
      set score = excluded.score, reasons = excluded.reasons, status = 'activo'
    returning id into new_match_id;
  end if;

  return query select result_swipe_id, reciprocal_like, new_match_id, calculated_score, calculated_reasons;
end;
$$;

alter table public.subjects enable row level security;
alter table public.profiles enable row level security;
alter table public.profile_subjects enable row level security;
alter table public.posts enable row level security;
alter table public.saved_posts enable row level security;
alter table public.swipes enable row level security;
alter table public.matches enable row level security;
alter table public.study_sessions enable row level security;

create policy "Cualquiera puede leer clases" on public.subjects for select using (true);
create policy "Cualquiera puede leer perfiles" on public.profiles for select using (true);
create policy "Usuario actualiza su perfil" on public.profiles for update
  using (auth_user_id = auth.uid()) with check (auth_user_id = auth.uid());
create policy "Cualquiera puede leer materias de perfiles" on public.profile_subjects for select using (true);
create policy "Usuario administra sus materias" on public.profile_subjects for all
  using (profile_id = public.current_profile_id()) with check (profile_id = public.current_profile_id());
create policy "Cualquiera lee publicaciones activas" on public.posts for select using (status = 'publicada' or author_id = public.current_profile_id());
create policy "Usuario crea sus publicaciones" on public.posts for insert with check (author_id = public.current_profile_id());
create policy "Usuario administra sus publicaciones" on public.posts for update
  using (author_id = public.current_profile_id()) with check (author_id = public.current_profile_id());
create policy "Usuario elimina sus publicaciones" on public.posts for delete using (author_id = public.current_profile_id());
create policy "Usuario administra sus guardados" on public.saved_posts for all
  using (profile_id = public.current_profile_id()) with check (profile_id = public.current_profile_id());
create policy "Usuario lee sus swipes" on public.swipes for select using (actor_id = public.current_profile_id());
create policy "Participantes leen sus matches" on public.matches for select
  using (user_a_id = public.current_profile_id() or user_b_id = public.current_profile_id());
create policy "Participantes leen sus sesiones" on public.study_sessions for select
  using (exists (select 1 from public.matches m where m.id = match_id and (m.user_a_id = public.current_profile_id() or m.user_b_id = public.current_profile_id())));
create policy "Participante propone sesión" on public.study_sessions for insert
  with check (proposer_id = public.current_profile_id() and exists (select 1 from public.matches m where m.id = match_id and (m.user_a_id = public.current_profile_id() or m.user_b_id = public.current_profile_id())));
create policy "Participante actualiza sesión" on public.study_sessions for update
  using (exists (select 1 from public.matches m where m.id = match_id and (m.user_a_id = public.current_profile_id() or m.user_b_id = public.current_profile_id())));

-- Buckets públicos de lectura para que las tarjetas puedan mostrar medios en la demo.
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true), ('posts', 'posts', true)
on conflict (id) do update set public = excluded.public;
create policy "Lectura pública de avatares" on storage.objects for select using (bucket_id = 'avatars');
create policy "Lectura pública de publicaciones" on storage.objects for select using (bucket_id = 'posts');
create policy "Usuario sube sus medios" on storage.objects for insert to authenticated
  with check (bucket_id in ('avatars', 'posts') and owner_id = (auth.uid())::text);
create policy "Usuario actualiza sus medios" on storage.objects for update to authenticated
  using (bucket_id in ('avatars', 'posts') and owner_id = (auth.uid())::text);
create policy "Usuario elimina sus medios" on storage.objects for delete to authenticated
  using (bucket_id in ('avatars', 'posts') and owner_id = (auth.uid())::text);

grant usage on schema public to anon, authenticated;
grant select on public.subjects, public.profiles, public.profile_subjects, public.posts to anon, authenticated;
grant select, insert, update, delete on public.saved_posts, public.profile_subjects, public.posts, public.study_sessions to authenticated;
grant select on public.swipes, public.matches to authenticated;
grant execute on function public.match_score(uuid, uuid), public.record_swipe(uuid, public.swipe_decision) to authenticated;
