import { BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";

import { feedPosts, subjects } from "@/data/feed";

export default function ClassesPage() {
  return (
    <main className="min-h-screen bg-[#F3F4F6] px-4 py-7 text-[#1F2937]">
      <section className="mx-auto max-w-[480px]">
        <Link className="text-sm font-semibold text-[#3B82F6]" href="/">← Inicio</Link>
        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.14em] text-[#14B8A6]">Explora</p>
        <h1 className="mt-2 text-3xl font-bold">Clases</h1>
        <p className="mt-2 text-sm leading-6 text-[#1F2937]/60">Encuentra recursos para la materia que quieres dominar.</p>
        <div className="mt-7 space-y-3">
          {subjects.filter((subject) => subject !== "Todo").map((subject) => {
            const count = feedPosts.filter((post) => post.subject === subject).length;
            return (
              <Link key={subject} href="/" className="flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-black/5 transition hover:bg-[#DBEAFE]">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#14B8A6] text-white"><BookOpen size={21} /></span>
                <span className="flex-1"><strong className="block">{subject}</strong><span className="text-sm text-[#1F2937]/60">{count} recursos disponibles</span></span>
                <ChevronRight className="text-[#1F2937]/40" aria-hidden="true" />
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
