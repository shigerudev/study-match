"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  BookOpen,
  Compass,
  Heart,
  Home,
  Plus,
  Search,
  UserRound,
  Video,
} from "lucide-react";
import { useMemo, useState } from "react";

import { feedPosts, subjects, type FeedPost, type Subject } from "@/data/feed";

const artworkStyles: Record<FeedPost["artwork"], string> = {
  calculus: "from-violet-600 via-indigo-500 to-cyan-400",
  english: "from-orange-400 via-rose-400 to-fuchsia-500",
  physics: "from-sky-500 via-blue-600 to-indigo-800",
  code: "from-emerald-500 via-teal-500 to-cyan-700",
  design: "from-yellow-300 via-pink-500 to-violet-600",
  notes: "from-amber-300 via-orange-400 to-rose-500",
};

const artworkText: Record<FeedPost["artwork"], string> = {
  calculus: "f(x) = (3x² + 1)⁴",
  english: "Phrasal\nverbs",
  physics: "v₀  ↗  ·  g",
  code: "const aprender = () => ✦",
  design: "MAKE IT\nCLEAR",
  notes: "LÍMITES\nPASO A PASO",
};

function PostArtwork({ post }: { post: FeedPost }) {
  return (
    <div className={`relative aspect-video overflow-hidden rounded-2xl bg-gradient-to-br ${artworkStyles[post.artwork]} p-5 shadow-inner`}>
      <div className="absolute -right-7 -top-8 h-36 w-36 rounded-full border-[18px] border-white/20" />
      <div className="absolute -bottom-12 left-8 h-32 w-32 rounded-full bg-white/15 blur-2xl" />
      <p className="relative max-w-[75%] whitespace-pre-line font-mono text-lg font-bold leading-snug text-white drop-shadow-sm">
        {artworkText[post.artwork]}
      </p>
      {post.type === "video" && (
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-lg bg-black/65 px-2 py-1 text-xs font-semibold text-white">
          <Video size={13} fill="currentColor" /> 0:58
        </span>
      )}
      {post.type === "video" && (
        <span className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 pl-0.5 text-[#201e35] shadow-lg">
          ▶
        </span>
      )}
    </div>
  );
}

export default function HomePage() {
  const [selectedSubject, setSelectedSubject] = useState<Subject>("Todo");
  const [query, setQuery] = useState("");

  const visiblePosts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("es");
    return feedPosts.filter((post) => {
      const matchesSubject = selectedSubject === "Todo" || post.subject === selectedSubject;
      const searchable = [post.title, post.subject, post.author, ...post.tags].join(" ").toLocaleLowerCase("es");
      return matchesSubject && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [query, selectedSubject]);

  return (
    <main className="min-h-screen bg-[#0e0e10] text-white">
      <section className="mx-auto min-h-screen max-w-[480px] bg-[#0e0e10] pb-24">
        <header className="sticky top-0 z-20 bg-[#0e0e10]/95 px-4 pb-3 pt-5 backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <Link href="/home" className="inline-flex h-11 items-center" aria-label="Inicio de StudyMatch">
              <Image
                src="/brand/studymatch-logo.png"
                alt="StudyMatch"
                width={132}
                height={44}
                priority
                className="h-11 w-[132px] object-contain object-left"
              />
            </Link>
            <button type="button" aria-label="Ver notificaciones" className="grid h-10 w-10 place-items-center rounded-full text-zinc-100 hover:bg-white/10">
              <Bell size={21} />
            </button>
          </div>
          <label className="mt-4 flex h-11 items-center gap-2 rounded-xl bg-[#27272b] px-3 text-zinc-400 ring-1 ring-white/5 focus-within:ring-violet-400">
            <Search size={19} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar clases, temas o personas"
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
              aria-label="Buscar publicaciones"
            />
          </label>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            {subjects.map((subject) => (
              <button
                key={subject}
                type="button"
                onClick={() => setSelectedSubject(subject)}
                className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition ${selectedSubject === subject ? "bg-white text-[#171719]" : "bg-[#27272b] text-zinc-200 hover:bg-[#35353a]"}`}
              >
                {subject}
              </button>
            ))}
          </div>
        </header>

        <div className="px-4 pt-2">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-sm text-violet-300">Para ti</p>
              <h1 className="text-xl font-bold">Aprende algo nuevo hoy</h1>
            </div>
            <Link href="/classes" className="text-sm font-semibold text-violet-300">Ver clases</Link>
          </div>

          <div className="space-y-6">
            {visiblePosts.map((post) => (
              <article key={post.id} className="group">
                <PostArtwork post={post} />
                <div className="mt-3 flex gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-indigo-400 to-fuchsia-500 text-xs font-bold text-white">
                    {post.avatar}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-2">
                      <h2 className="flex-1 text-[15px] font-bold leading-5 text-zinc-50">{post.title}</h2>
                      <button type="button" aria-label={`Más opciones de ${post.title}`} className="-mt-1 rounded-full p-1 text-zinc-400 hover:bg-white/10">•••</button>
                    </div>
                    <p className="mt-1 text-sm text-zinc-400">{post.author} · <span className="text-violet-300">{post.subject}</span></p>
                    <p className="text-sm text-zinc-500">{post.views} · {post.createdAt}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {visiblePosts.length === 0 && (
            <div className="mt-12 rounded-2xl border border-dashed border-zinc-700 bg-[#18181b] px-6 py-10 text-center">
              <BookOpen className="mx-auto text-violet-300" size={30} />
              <h2 className="mt-3 font-bold">Aún no hay recursos</h2>
              <p className="mt-1 text-sm leading-5 text-zinc-400">Prueba otra búsqueda o explora una clase distinta.</p>
              <button type="button" onClick={() => { setQuery(""); setSelectedSubject("Todo"); }} className="mt-4 text-sm font-semibold text-violet-300">Limpiar filtros</button>
            </div>
          )}
        </div>

        <nav aria-label="Navegación principal" className="fixed bottom-0 left-1/2 z-30 flex h-[72px] w-full max-w-[480px] -translate-x-1/2 items-center justify-around border-t border-white/10 bg-[#171719] px-2 pb-1">
          <Link href="/home" className="flex min-w-14 flex-col items-center gap-1 text-xs font-medium text-white"><Home size={22} fill="currentColor" />Inicio</Link>
          <Link href="/classes" className="flex min-w-14 flex-col items-center gap-1 text-xs font-medium text-zinc-400"><Compass size={22} />Clases</Link>
          <Link href="/create" aria-label="Crear publicación" className="-mt-7 grid h-14 w-14 place-items-center rounded-full border-4 border-[#0e0e10] bg-white text-[#171719] shadow-lg"><Plus size={29} strokeWidth={2.6} /></Link>
          <Link href="/match" className="flex min-w-14 flex-col items-center gap-1 text-xs font-medium text-zinc-400"><Heart size={22} />Match</Link>
          <Link href="/profile" className="flex min-w-14 flex-col items-center gap-1 text-xs font-medium text-zinc-400"><UserRound size={22} />Perfil</Link>
        </nav>
      </section>
    </main>
  );
}
