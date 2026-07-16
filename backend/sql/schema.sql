-- StudyMatch MVP — ejecutar en SQL Editor de Supabase (desde cero)
-- Orden: schema.sql → seed.sql

create extension if not exists "pgcrypto";

-- Limpieza (seguro en proyecto vacío de hackatón)
drop table if exists sessions cascade;
drop table if exists matches cascade;
drop table if exists swipes cascade;
drop table if exists posts cascade;
drop table if exists users cascade;
drop table if exists subjects cascade;

create table subjects (
  id text primary key,
  name text not null,
  color text not null
);

create table users (
  id text primary key,
  name text not null,
  avatar_url text,
  role text not null check (role in ('estudiante', 'profesor', 'ambos')),
  bio text default '',
  career text default '',
  subjects jsonb not null default '[]'::jsonb,
  goals jsonb not null default '[]'::jsonb,
  availability jsonb not null default '[]'::jsonb,
  level text default 'intermedio',
  created_at timestamptz not null default now()
);

create table posts (
  id text primary key,
  author_id text not null references users (id) on delete cascade,
  subject_id text not null references subjects (id),
  type text not null check (type in ('photo', 'video')),
  title text not null,
  description text default '',
  tags jsonb not null default '[]'::jsonb,
  media_url text not null,
  status text not null default 'publicada'
    check (status in ('publicada', 'eliminada')),
  created_at timestamptz not null default now()
);

create table swipes (
  id text primary key,
  actor_id text not null references users (id) on delete cascade,
  target_id text not null references users (id) on delete cascade,
  decision text not null check (decision in ('skip', 'like')),
  created_at timestamptz not null default now(),
  constraint swipes_actor_target_unique unique (actor_id, target_id),
  constraint swipes_no_self check (actor_id <> target_id)
);

create table matches (
  id text primary key,
  user_a_id text not null references users (id) on delete cascade,
  user_b_id text not null references users (id) on delete cascade,
  score integer not null check (score between 0 and 100),
  reasons jsonb not null default '[]'::jsonb,
  status text not null default 'activo'
    check (status in ('activo', 'archivado')),
  created_at timestamptz not null default now(),
  constraint matches_pair_unique unique (user_a_id, user_b_id),
  constraint matches_ordered check (user_a_id < user_b_id)
);

create table sessions (
  id text primary key,
  match_id text not null references matches (id) on delete cascade,
  proposer_id text not null references users (id) on delete cascade,
  scheduled_at timestamptz not null,
  duration_minutes integer not null check (duration_minutes in (30, 60)),
  modality text not null check (modality in ('virtual', 'presencial')),
  status text not null default 'pendiente'
    check (status in ('pendiente', 'aceptada', 'cambio_propuesto', 'cancelada', 'completada')),
  created_at timestamptz not null default now()
);

create index posts_subject_idx on posts (subject_id);
create index posts_created_at_idx on posts (created_at desc);
create index swipes_actor_idx on swipes (actor_id);
create index swipes_target_idx on swipes (target_id);
create index matches_users_idx on matches (user_a_id, user_b_id);
create index sessions_match_idx on sessions (match_id);
