import { BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";

import { feedPosts, subjects } from "@/data/feed";

export default function ClassesPage() {
  return (
    <main className="min-h-screen bg-[#0e0e10] px-4 py-7 text-white">
      <section className="mx-auto max-w-[480px]">
        <Link className="text-sm font-semibold text-violet-300" href="/">← Inicio</Link>
        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.14em] text-[#ff786b]">Explora</p>
        <h1 className="mt-2 text-3xl font-bold">Clases</h1>
        <p className="mt-2 text-sm leading-6 text-zinc-400">Encuentra recursos para la materia que quieres dominar.</p>
        <div className="mt-7 space-y-3">
          {subjects.filter((subject) => subject !== "Todo").map((subject) => {
            const count = feedPosts.filter((post) => post.subject === subject).length;
            return (
              <Link key={subject} href="/" className="flex items-center gap-4 rounded-2xl bg-[#1b1b20] p-4 ring-1 ring-white/5 transition hover:bg-[#25252c]">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-[#ff7465]"><BookOpen size={21} /></span>
                <span className="flex-1"><strong className="block">{subject}</strong><span className="text-sm text-zinc-400">{count} recursos disponibles</span></span>
                <ChevronRight className="text-zinc-500" aria-hidden="true" />
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
