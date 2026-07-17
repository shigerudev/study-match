"use client";

import Image from "next/image";
import Link from "next/link";
import { BookOpen, Search, Video } from "lucide-react";
import { Suspense, useMemo, useState, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";

import { BottomNav } from "@/components/bottom-nav";
import {
  getFeedPosts,
  subjects,
  subscribeFeed,
  type FeedPost,
  type Subject,
} from "@/data/feed";

const artworkStyles: Record<FeedPost["artwork"], string> = {
  calculus: "from-[#3B82F6] via-[#14B8A6] to-[#FBBF24]",
  english: "from-[#14B8A6] via-[#3B82F6] to-[#FBBF24]",
  physics: "from-[#1F2937] via-[#3B82F6] to-[#14B8A6]",
  code: "from-[#14B8A6] via-[#3B82F6] to-[#1F2937]",
  design: "from-[#FBBF24] via-[#14B8A6] to-[#3B82F6]",
  notes: "from-[#FBBF24] via-[#3B82F6] to-[#14B8A6]",
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
        <span className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 pl-0.5 text-[#1F2937] shadow-lg">
          ▶
        </span>
      )}
    </div>
  );
}

export function HomePage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#F3F4F6]" />}>
      <HomeFeedShell />
    </Suspense>
  );
}

function HomeFeedShell() {
  const searchParams = useSearchParams();
  const subjectParam = searchParams.get("subject") ?? "Todo";
  return <HomeFeed key={subjectParam} subjectParam={subjectParam} />;
}

function HomeFeed({ subjectParam }: { subjectParam: string }) {
  const urlSubject =
    subjectParam && subjects.includes(subjectParam as Subject)
      ? (subjectParam as Subject)
      : "Todo";

  const [selectedSubject, setSelectedSubject] = useState<Subject>(urlSubject);
  const [query, setQuery] = useState("");
  const posts = useSyncExternalStore(subscribeFeed, getFeedPosts, getFeedPosts);

  const visiblePosts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("es");
    return posts.filter((post) => {
      const matchesSubject = selectedSubject === "Todo" || post.subject === selectedSubject;
      const searchable = [post.title, post.description, post.subject, post.author, ...post.tags]
        .join(" ")
        .toLocaleLowerCase("es");
      return matchesSubject && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [posts, query, selectedSubject]);

  return (
    <main className="min-h-screen bg-[#F3F4F6] text-[#1F2937]">
      <section className="mx-auto min-h-screen max-w-[480px] bg-[#F3F4F6] pb-24">
        <header className="sticky top-0 z-20 bg-white/95 px-4 pb-3 pt-5 shadow-sm backdrop-blur">
          <div className="flex items-center gap-3">
            <Link href="/" className="inline-flex h-11 items-center" aria-label="Ver presentación de StudyMatch">
              <Image
                src="/brand/studymatch-logo.png"
                alt="StudyMatch"
                width={132}
                height={44}
                priority
                className="h-11 w-[132px] object-contain object-left"
              />
            </Link>
          </div>
          <label className="mt-4 flex h-11 items-center gap-2 rounded-xl bg-[#F3F4F6] px-3 text-[#1F2937]/60 ring-1 ring-[#3B82F6]/20 focus-within:ring-[#3B82F6]">
            <Search size={19} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar clases, temas o personas"
              className="min-w-0 flex-1 bg-transparent text-sm text-[#1F2937] outline-none placeholder:text-[#1F2937]/50"
              aria-label="Buscar publicaciones"
            />
          </label>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            {subjects.map((subject) => (
              <button
                key={subject}
                type="button"
                onClick={() => setSelectedSubject(subject)}
                className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition ${selectedSubject === subject ? "bg-[#3B82F6] text-white" : "bg-white text-[#1F2937] ring-1 ring-black/5 hover:bg-[#DBEAFE]"}`}
              >
                {subject}
              </button>
            ))}
          </div>
        </header>

        <div className="px-4 pt-2">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-sm text-[#14B8A6]">Para ti</p>
              <h1 className="text-xl font-bold">Aprende algo nuevo hoy</h1>
            </div>
            <Link href="/classes" className="text-sm font-semibold text-[#3B82F6]">Ver clases</Link>
          </div>

          <div className="space-y-6">
            {visiblePosts.map((post) => (
              <article key={post.id} className="group">
                <PostArtwork post={post} />
                <div className="mt-3 flex gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#3B82F6] to-[#14B8A6] text-xs font-bold text-white">
                    {post.avatar}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-[15px] font-bold leading-5 text-[#1F2937]">{post.title}</h2>
                    <p className="mt-1 text-sm leading-5 text-[#1F2937]/65">{post.description}</p>
                    <p className="mt-1 text-sm text-[#1F2937]/60">
                      {post.author} · <span className="text-[#14B8A6]">{post.subject}</span>
                    </p>
                    <p className="text-sm text-[#1F2937]/50">
                      {post.views} · {post.createdAt}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {visiblePosts.length === 0 && (
            <div className="mt-12 rounded-2xl border border-dashed border-[#3B82F6]/40 bg-white px-6 py-10 text-center">
              <BookOpen className="mx-auto text-[#3B82F6]" size={30} />
              <h2 className="mt-3 font-bold">Aún no hay recursos</h2>
              <p className="mt-1 text-sm leading-5 text-[#1F2937]/60">Prueba otra búsqueda o explora una clase distinta.</p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setSelectedSubject("Todo");
                }}
                className="mt-4 text-sm font-semibold text-[#3B82F6]"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        <BottomNav />
      </section>
    </main>
  );
}
