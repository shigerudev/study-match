"use client";

import { AnimatePresence, motion } from "motion/react";
import { CalendarDays, Check, ChevronLeft, Heart, House, MapPin, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { matchCandidates } from "@/data/match-data";

type View = "discover" | "matched" | "schedule" | "scheduled";

export function MatchExperience() {
  const [index, setIndex] = useState(0);
  const [view, setView] = useState<View>("discover");
  const candidate = matchCandidates[index];

  const next = (liked: boolean) => {
    if (liked && candidate?.isMutualMatch) {
      setView("matched");
      return;
    }
    setIndex((current) => current + 1);
  };

  if (view === "matched") {
    return <MatchCelebration onSchedule={() => setView("schedule")} onContinue={() => { setIndex((current) => current + 1); setView("discover"); }} />;
  }

  if (view === "schedule") return <ScheduleForm onBack={() => setView("matched")} onDone={() => setView("scheduled")} />;
  if (view === "scheduled") return <ScheduleSuccess onBack={() => { setIndex((current) => current + 1); setView("discover"); }} />;

  return (
    <main className="min-h-screen bg-[#f8f8fc] px-4 pb-28 pt-7 text-slate-900 sm:px-6">
      <div className="mx-auto max-w-md">
        <HomeLink />
        <header className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-violet-600">Encuentra tu equipo</p>
            <h1 className="text-3xl font-bold tracking-tight">Match</h1>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700"><Sparkles size={21} /></div>
        </header>

        {candidate ? (
          <AnimatePresence mode="wait">
            <motion.article
              key={candidate.id}
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, x: 140, rotate: 8 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.8}
              onDragEnd={(_, info) => { if (info.offset.x > 110) next(true); if (info.offset.x < -110) next(false); }}
              className="overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-violet-950/10 ring-1 ring-slate-200"
            >
              <div className={`relative flex h-56 items-end bg-gradient-to-br ${candidate.accent} p-6`}>
                <div className="absolute right-6 top-6 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white/70 bg-white/20 text-xl font-bold text-white backdrop-blur-sm">{candidate.initials}</div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
                <div className="relative text-white">
                  <h2 className="text-3xl font-bold">{candidate.name}</h2>
                  <p className="mt-1 text-sm font-medium text-white/85">{candidate.role} · {candidate.career}</p>
                  <span className="mt-3 inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                    {candidate.intentLabel}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-5 flex items-center justify-between">
                  <span className="rounded-full bg-violet-100 px-3 py-1.5 text-sm font-bold text-violet-700">{candidate.compatibility}% compatible</span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Perfil {index + 1} de {matchCandidates.length}</span>
                </div>
                <p className="text-[15px] leading-6 text-slate-600">{candidate.bio}</p>
                <div className="mt-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Materias</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {candidate.subjects.map((subject) => (
                      <span key={subject} className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700">{subject}</span>
                    ))}
                  </div>
                </div>
                <div className="mt-5 space-y-3 rounded-2xl bg-slate-50 p-4 text-sm">
                  <div className="flex gap-3"><Sparkles className="mt-0.5 shrink-0 text-violet-600" size={17} /><p><strong>Objetivo:</strong> {candidate.goal}</p></div>
                  <div className="flex gap-3"><CalendarDays className="mt-0.5 shrink-0 text-violet-600" size={17} /><p>{candidate.availability}</p></div>
                  <div className="flex gap-3"><MapPin className="mt-0.5 shrink-0 text-violet-600" size={17} /><p>{candidate.reasons.join(" · ")}</p></div>
                </div>
              </div>
            </motion.article>
          </AnimatePresence>
        ) : <EmptyMatches />}
        {candidate && <div className="mt-7 flex items-center justify-center gap-5"><button aria-label="Omitir perfil" onClick={() => next(false)} className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-rose-500 shadow-lg shadow-slate-300/50 ring-1 ring-slate-200 transition hover:scale-105"><X size={29} strokeWidth={2.5} /></button><button aria-label="Mostrar interés" onClick={() => next(true)} className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-600 text-white shadow-lg shadow-violet-300 transition hover:scale-105"><Heart size={27} fill="currentColor" /></button></div>}
        <p className="mt-5 text-center text-sm text-slate-400">Desliza para elegir o usa los botones</p>
      </div>
    </main>
  );
}

function MatchCelebration({ onSchedule, onContinue }: { onSchedule: () => void; onContinue: () => void }) {
  return <main className="relative flex min-h-screen items-center justify-center bg-gradient-to-b from-violet-100 via-[#f8f8fc] to-white px-5 text-center"><HomeLink className="absolute left-5 top-6" /><section className="w-full max-w-sm rounded-[2rem] bg-white p-8 shadow-xl shadow-violet-950/10"><div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-violet-100 text-violet-600"><Heart size={45} fill="currentColor" /></div><p className="mt-7 text-sm font-bold uppercase tracking-[0.18em] text-violet-600">Conexión creada</p><h1 className="mt-2 text-3xl font-bold tracking-tight">¡Hicieron match!</h1><p className="mt-3 leading-6 text-slate-600">Tú y María coinciden en <strong>Cálculo I</strong> y tienen disponibilidad por la tarde.</p><button onClick={onSchedule} className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 py-4 font-bold text-white shadow-lg shadow-violet-200"><CalendarDays size={19} /> Agendar sesión</button><button onClick={onContinue} className="mt-3 w-full rounded-2xl px-5 py-3 font-semibold text-slate-500">Seguir explorando</button></section></main>;
}

function ScheduleForm({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  return <main className="min-h-screen bg-[#f8f8fc] px-5 pt-8"><section className="mx-auto max-w-md"><div className="mb-6 flex items-center justify-between"><button onClick={onBack} className="flex items-center gap-1 text-sm font-semibold text-slate-500"><ChevronLeft size={18} /> Volver al match</button><HomeLink className="mb-0" /></div><h1 className="text-3xl font-bold">Agenda con María</h1><p className="mt-2 text-slate-600">Propón un momento para su sesión de Cálculo I.</p><div className="mt-7 space-y-5 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200"><label className="block text-sm font-bold text-slate-700">Fecha<input defaultValue="2026-07-18" type="date" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-slate-700 outline-violet-500" /></label><label className="block text-sm font-bold text-slate-700">Hora<input defaultValue="17:00" type="time" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-slate-700 outline-violet-500" /></label><div><p className="text-sm font-bold text-slate-700">Duración</p><div className="mt-2 grid grid-cols-2 gap-3"><button className="rounded-xl border-2 border-violet-600 bg-violet-50 py-3 font-bold text-violet-700">60 min</button><button className="rounded-xl border border-slate-200 py-3 font-semibold text-slate-500">30 min</button></div></div><div><p className="text-sm font-bold text-slate-700">Modalidad</p><div className="mt-2 grid grid-cols-2 gap-3"><button className="rounded-xl border-2 border-violet-600 bg-violet-50 py-3 font-bold text-violet-700">Virtual</button><button className="rounded-xl border border-slate-200 py-3 font-semibold text-slate-500">Presencial</button></div></div><button onClick={onDone} className="w-full rounded-2xl bg-violet-600 py-4 font-bold text-white shadow-lg shadow-violet-200">Enviar propuesta</button></div></section></main>;
}

function ScheduleSuccess({ onBack }: { onBack: () => void }) { return <main className="relative flex min-h-screen items-center justify-center bg-[#f8f8fc] p-5 text-center"><HomeLink className="absolute left-5 top-6" /><section className="w-full max-w-sm rounded-[2rem] bg-white p-8 shadow-sm"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"><Check size={32} /></div><h1 className="mt-6 text-2xl font-bold">Propuesta enviada</h1><p className="mt-2 leading-6 text-slate-600">María recibirá tu solicitud para una sesión virtual de 60 min.</p><button onClick={onBack} className="mt-7 w-full rounded-2xl bg-violet-600 py-4 font-bold text-white">Ver más perfiles</button></section></main>; }
function EmptyMatches() { return <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm ring-1 ring-slate-200"><Sparkles className="mx-auto text-violet-500" size={34} /><h2 className="mt-4 text-xl font-bold">Ya viste todos los perfiles</h2><p className="mt-2 text-slate-500">Vuelve pronto para descubrir nuevas personas compatibles.</p><Link href="/home" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-bold text-white"><House size={18} /> Regresar a Inicio</Link></div>; }

function HomeLink({ className = "mb-5" }: { className?: string }) {
  return <Link href="/home" className={`inline-flex items-center gap-2 text-sm font-semibold text-violet-700 transition hover:text-violet-900 ${className}`}><House size={18} /> Regresar a Inicio</Link>;
}
