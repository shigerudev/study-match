"use client";

import {
  Bookmark,
  CalendarDays,
  ChevronLeft,
  Clock3,
  Edit3,
  Grid2X2,
  Play,
  Plus,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useState, useSyncExternalStore } from "react";
import { BottomNav } from "@/components/bottom-nav";
import {
  getProfile,
  getProfileSessions,
  profilePosts,
  savedPosts,
  subscribeProfile,
  subscribeSessions,
  updateProfile,
  updateSessionStatus,
} from "@/data/match-data";

type Tab = "posts" | "sessions" | "saved";

export function ProfileView() {
  const profile = useSyncExternalStore(subscribeProfile, getProfile, getProfile);
  const sessions = useSyncExternalStore(subscribeSessions, getProfileSessions, getProfileSessions);
  const [tab, setTab] = useState<Tab>("posts");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    name: profile.name,
    bio: profile.bio,
    availability: profile.availability,
    role: profile.role,
  });

  function openEditor() {
    setDraft({
      name: profile.name,
      bio: profile.bio,
      availability: profile.availability,
      role: profile.role,
    });
    setEditing(true);
  }

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateProfile({
      name: draft.name.trim(),
      bio: draft.bio.trim(),
      availability: draft.availability.trim(),
      role: draft.role.trim(),
    });
    setEditing(false);
  }

  return (
    <main className="min-h-screen bg-[#F3F4F6] pb-28 text-[#1F2937]">
      <div className="mx-auto max-w-md">
        <header className="flex items-center justify-between px-5 pb-4 pt-7">
          <div>
            <Link href="/home" className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-[#3B82F6]">
              <ChevronLeft size={18} /> Regresar a Inicio
            </Link>
            <h1 className="text-2xl font-bold">Perfil</h1>
          </div>
          <button
            type="button"
            aria-label="Configuración"
            onClick={openEditor}
            className="rounded-xl p-2 text-[#1F2937]/60 hover:bg-white"
          >
            <Settings size={21} />
          </button>
        </header>

        <section className="bg-white px-5 pb-6 pt-2">
          <div className="flex items-start gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.6rem] bg-gradient-to-br from-[#3B82F6] to-[#14B8A6] text-xl font-bold text-white shadow-lg shadow-blue-200">
              {profile.initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex gap-2">
                <h2 className="truncate text-xl font-bold">{profile.name}</h2>
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#14B8A6]" />
              </div>
              <p className="mt-0.5 text-sm text-[#1F2937]/60">{profile.role}</p>
              <p className="text-sm text-[#1F2937]/60">{profile.career}</p>
            </div>
          </div>
          <p className="mt-5 text-[15px] leading-6 text-[#1F2937]/70">{profile.bio}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.subjects.map((subject) => (
              <span key={subject} className="rounded-lg bg-[#DBEAFE] px-3 py-1.5 text-sm font-semibold text-[#3B82F6]">
                {subject}
              </span>
            ))}
          </div>
          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={openEditor}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#3B82F6] py-3 text-sm font-bold text-white"
            >
              <Edit3 size={16} /> Editar perfil
            </button>
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-black/10 py-3 text-sm font-bold text-[#1F2937]"
            >
              <CalendarDays size={16} /> {profile.availability}
            </button>
          </div>
        </section>

        <div className="mt-3 bg-white px-5">
          <div className="grid grid-cols-3">
            <TabButton active={tab === "posts"} onClick={() => setTab("posts")} icon={<Grid2X2 size={18} />} label="Publicaciones" />
            <TabButton active={tab === "sessions"} onClick={() => setTab("sessions")} icon={<CalendarDays size={18} />} label="Sesiones" />
            <TabButton active={tab === "saved"} onClick={() => setTab("saved")} icon={<Bookmark size={18} />} label="Guardados" />
          </div>
        </div>

        <section className="px-5 py-5">
          {tab === "posts" && <Posts />}
          {tab === "sessions" && <Sessions sessions={sessions} />}
          {tab === "saved" && <Saved />}
        </section>
      </div>

      {editing && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <form onSubmit={saveProfile} className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold">Editar perfil</h2>
            <p className="mt-1 text-sm text-[#1F2937]/60">Demo local: los cambios se ven en esta sesión.</p>
            <label className="mt-5 block text-sm font-semibold">
              Nombre
              <input
                className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 font-normal outline-none focus:border-[#3B82F6]"
                value={draft.name}
                onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
                required
              />
            </label>
            <label className="mt-4 block text-sm font-semibold">
              Rol
              <select
                className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 font-normal outline-none focus:border-[#3B82F6]"
                value={draft.role}
                onChange={(event) => setDraft((current) => ({ ...current, role: event.target.value }))}
              >
                <option>Estudiante</option>
                <option>Profesor</option>
                <option>Ambos</option>
              </select>
            </label>
            <label className="mt-4 block text-sm font-semibold">
              Biografía
              <textarea
                className="mt-2 min-h-24 w-full rounded-xl border border-black/10 px-4 py-3 font-normal outline-none focus:border-[#3B82F6]"
                value={draft.bio}
                onChange={(event) => setDraft((current) => ({ ...current, bio: event.target.value }))}
              />
            </label>
            <label className="mt-4 block text-sm font-semibold">
              Disponibilidad
              <input
                className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 font-normal outline-none focus:border-[#3B82F6]"
                value={draft.availability}
                onChange={(event) => setDraft((current) => ({ ...current, availability: event.target.value }))}
                required
              />
            </label>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setEditing(false)} className="flex-1 rounded-xl border border-black/10 py-3 font-semibold">
                Cancelar
              </button>
              <button type="submit" className="flex-1 rounded-xl bg-[#3B82F6] py-3 font-bold text-white">
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}

      <BottomNav />
    </main>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-1 border-b-2 py-3 text-xs font-bold ${
        active ? "border-[#3B82F6] text-[#3B82F6]" : "border-transparent text-[#1F2937]/40"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function Posts() {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Tus recursos</h2>
          <p className="text-sm text-[#1F2937]/60">{profilePosts.length} publicaciones compartidas</p>
        </div>
        <Link
          href="/create"
          aria-label="Crear publicación"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3B82F6] text-white"
        >
          <Plus size={21} />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {profilePosts.map((post) => (
          <article key={post.id} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
            <div className={`relative flex aspect-[4/3] items-end bg-gradient-to-br ${post.accent} p-3`}>
              <span className="rounded-md bg-black/30 px-2 py-1 text-xs font-bold text-white">
                {post.type === "Video" && <Play className="mr-1 inline" size={12} fill="currentColor" />}
                {post.type}
              </span>
            </div>
            <div className="p-3">
              <p className="text-xs font-semibold text-[#3B82F6]">{post.subject}</p>
              <h3 className="mt-1 text-sm font-bold leading-5">{post.title}</h3>
              <p className="mt-2 text-xs text-[#1F2937]/40">{post.views} vistas</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Sessions({ sessions }: { sessions: ReturnType<typeof getProfileSessions> }) {
  return (
    <div>
      <h2 className="text-lg font-bold">Tus sesiones</h2>
      <p className="mb-4 text-sm text-[#1F2937]/60">Organiza tu semana de estudio.</p>
      <div className="space-y-3">
        {sessions.map((session) => (
          <article key={session.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#3B82F6] to-[#14B8A6] text-sm font-bold text-white">
                {session.initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold">{session.person}</h3>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${session.accent}`}>{session.status}</span>
                </div>
                <p className="mt-0.5 text-sm font-medium text-[#3B82F6]">{session.subject}</p>
                <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#1F2937]/50">
                  <span className="flex items-center gap-1">
                    <CalendarDays size={13} />
                    {session.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock3 size={13} />
                    {session.duration}
                  </span>
                  <span>{session.modality}</span>
                </div>
                {session.status === "Pendiente" && (
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => updateSessionStatus(session.id, "Aceptada")}
                      className="rounded-lg bg-[#14B8A6] px-3 py-1.5 text-xs font-bold text-white"
                    >
                      Aceptar
                    </button>
                    <button
                      type="button"
                      onClick={() => updateSessionStatus(session.id, "Cambio propuesto")}
                      className="rounded-lg border border-black/10 px-3 py-1.5 text-xs font-bold text-[#1F2937]"
                    >
                      Proponer cambio
                    </button>
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
        {sessions.length === 0 && (
          <p className="rounded-2xl border border-dashed border-[#3B82F6]/40 bg-white px-4 py-8 text-center text-sm text-[#1F2937]/60">
            Aún no tienes sesiones. Agenda una desde Match.
          </p>
        )}
      </div>
    </div>
  );
}

function Saved() {
  return (
    <div>
      <h2 className="text-lg font-bold">Guardados para después</h2>
      <p className="mb-4 text-sm text-[#1F2937]/60">Recursos que quieres revisar.</p>
      <div className="space-y-3">
        {savedPosts.map((post) => (
          <article key={post.id} className="flex overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
            <div className={`w-24 shrink-0 bg-gradient-to-br ${post.accent}`} />
            <div className="min-w-0 p-4">
              <p className="text-xs font-semibold text-[#3B82F6]">
                {post.subject} · {post.author}
              </p>
              <h3 className="mt-1 font-bold leading-5">{post.title}</h3>
              <Link
                href={`/home?subject=${encodeURIComponent(post.subject)}`}
                className="mt-3 inline-block text-sm font-bold text-[#3B82F6]"
              >
                Ver en feed
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
