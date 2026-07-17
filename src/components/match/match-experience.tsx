"use client";

import { AnimatePresence, motion } from "motion/react";
import { CalendarDays, Check, ChevronLeft, Heart, House, MapPin, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { BottomNav } from "@/components/bottom-nav";
import { addPendingSession, matchCandidates, type MatchCandidate } from "@/data/match-data";

type View = "discover" | "matched" | "schedule" | "scheduled";

export function MatchExperience() {
  const [index, setIndex] = useState(0);
  const [view, setView] = useState<View>("discover");
  const [matched, setMatched] = useState<MatchCandidate | null>(null);
  const [lastSchedule, setLastSchedule] = useState({ duration: "60 min", modality: "Virtual" });
  const candidate = matchCandidates[index];

  const next = (liked: boolean) => {
    if (liked && candidate?.isMutualMatch) {
      setMatched(candidate);
      setView("matched");
      return;
    }
    setIndex((current) => current + 1);
  };

  if (view === "matched" && matched) {
    return (
      <MatchCelebration
        candidate={matched}
        onSchedule={() => setView("schedule")}
        onContinue={() => {
          setIndex((current) => current + 1);
          setView("discover");
        }}
      />
    );
  }

  if (view === "schedule" && matched) {
    return (
      <ScheduleForm
        candidate={matched}
        onBack={() => setView("matched")}
        onDone={(details) => {
          setLastSchedule(details);
          addPendingSession({
            person: matched.name,
            initials: matched.initials,
            subject: matched.sharedSubject,
            time: details.timeLabel,
            duration: details.duration,
            modality: details.modality,
          });
          setView("scheduled");
        }}
      />
    );
  }

  if (view === "scheduled" && matched) {
    return (
      <ScheduleSuccess
        candidate={matched}
        details={lastSchedule}
        onBack={() => {
          setIndex((current) => current + 1);
          setView("discover");
        }}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#F3F4F6] px-4 pb-28 pt-7 text-[#1F2937] sm:px-6">
      <div className="mx-auto max-w-md">
        <HomeLink />
        <header className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[#3B82F6]">Encuentra tu equipo</p>
            <h1 className="text-3xl font-bold tracking-tight">Match</h1>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#DBEAFE] text-[#3B82F6]">
            <Sparkles size={21} />
          </div>
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
              onDragEnd={(_, info) => {
                if (info.offset.x > 110) next(true);
                if (info.offset.x < -110) next(false);
              }}
              className="overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-blue-900/5 ring-1 ring-black/5"
            >
              <div className={`relative flex h-56 items-end bg-gradient-to-br ${candidate.accent} p-6`}>
                <div className="absolute right-6 top-6 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white/70 bg-white/20 text-xl font-bold text-white backdrop-blur-sm">
                  {candidate.initials}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
                <div className="relative text-white">
                  <h2 className="text-3xl font-bold">{candidate.name}</h2>
                  <p className="mt-1 text-sm font-medium text-white/85">
                    {candidate.role} · {candidate.career}
                  </p>
                  <span className="mt-3 inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                    {candidate.intentLabel}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-5 flex items-center justify-between">
                  <span className="rounded-full bg-[#DBEAFE] px-3 py-1.5 text-sm font-bold text-[#3B82F6]">
                    {candidate.compatibility}% compatible
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#1F2937]/40">
                    Perfil {index + 1} de {matchCandidates.length}
                  </span>
                </div>
                <p className="text-[15px] leading-6 text-[#1F2937]/70">{candidate.bio}</p>
                <div className="mt-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#1F2937]/40">Materias</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {candidate.subjects.map((subject) => (
                      <span key={subject} className="rounded-lg bg-[#F3F4F6] px-3 py-1.5 text-sm font-semibold text-[#1F2937]">
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-5 space-y-3 rounded-2xl bg-[#F3F4F6] p-4 text-sm">
                  <div className="flex gap-3">
                    <Sparkles className="mt-0.5 shrink-0 text-[#3B82F6]" size={17} />
                    <p>
                      <strong>Objetivo:</strong> {candidate.goal}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <CalendarDays className="mt-0.5 shrink-0 text-[#3B82F6]" size={17} />
                    <p>{candidate.availability}</p>
                  </div>
                  <div className="flex gap-3">
                    <MapPin className="mt-0.5 shrink-0 text-[#14B8A6]" size={17} />
                    <p>{candidate.reasons.join(" · ")}</p>
                  </div>
                </div>
              </div>
            </motion.article>
          </AnimatePresence>
        ) : (
          <EmptyMatches />
        )}

        {candidate && (
          <div className="mt-7 flex items-center justify-center gap-5">
            <button
              aria-label="Omitir perfil"
              onClick={() => next(false)}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-rose-500 shadow-lg shadow-slate-300/50 ring-1 ring-black/5 transition hover:scale-105"
            >
              <X size={29} strokeWidth={2.5} />
            </button>
            <button
              aria-label="Mostrar interés"
              onClick={() => next(true)}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-[#3B82F6] text-white shadow-lg shadow-blue-200 transition hover:scale-105"
            >
              <Heart size={27} fill="currentColor" />
            </button>
          </div>
        )}
        <p className="mt-5 text-center text-sm text-[#1F2937]/40">Desliza para elegir o usa los botones</p>
      </div>
      <BottomNav />
    </main>
  );
}

function MatchCelebration({
  candidate,
  onSchedule,
  onContinue,
}: {
  candidate: MatchCandidate;
  onSchedule: () => void;
  onContinue: () => void;
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-gradient-to-b from-[#DBEAFE] via-[#F3F4F6] to-white px-5 pb-28 text-center">
      <HomeLink className="absolute left-5 top-6" />
      <section className="w-full max-w-sm rounded-[2rem] bg-white p-8 shadow-xl shadow-blue-900/5">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#DBEAFE] text-[#3B82F6]">
          <Heart size={45} fill="currentColor" />
        </div>
        <p className="mt-7 text-sm font-bold uppercase tracking-[0.18em] text-[#3B82F6]">Conexión creada</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">¡Hicieron match!</h1>
        <p className="mt-3 leading-6 text-[#1F2937]/70">
          Tú y {candidate.name.split(" ")[0]} coinciden en <strong>{candidate.sharedSubject}</strong>
          {" "}y tienen disponibilidad compatible.
        </p>
        <button
          onClick={onSchedule}
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#3B82F6] px-5 py-4 font-bold text-white shadow-lg shadow-blue-200"
        >
          <CalendarDays size={19} /> Agendar sesión
        </button>
        <button onClick={onContinue} className="mt-3 w-full rounded-2xl px-5 py-3 font-semibold text-[#1F2937]/50">
          Seguir explorando
        </button>
      </section>
      <BottomNav />
    </main>
  );
}

function ScheduleForm({
  candidate,
  onBack,
  onDone,
}: {
  candidate: MatchCandidate;
  onBack: () => void;
  onDone: (details: { duration: string; modality: string; timeLabel: string }) => void;
}) {
  const [date, setDate] = useState("2026-07-18");
  const [time, setTime] = useState("17:00");
  const [duration, setDuration] = useState<"30 min" | "60 min">("60 min");
  const [modality, setModality] = useState<"Virtual" | "Presencial">("Virtual");

  return (
    <main className="min-h-screen bg-[#F3F4F6] px-5 pb-28 pt-8">
      <section className="mx-auto max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-1 text-sm font-semibold text-[#1F2937]/50">
            <ChevronLeft size={18} /> Volver al match
          </button>
          <HomeLink className="mb-0" />
        </div>
        <h1 className="text-3xl font-bold">Agenda con {candidate.name.split(" ")[0]}</h1>
        <p className="mt-2 text-[#1F2937]/60">Propón un momento para su sesión de {candidate.sharedSubject}.</p>
        <div className="mt-7 space-y-5 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-black/5">
          <label className="block text-sm font-bold text-[#1F2937]">
            Fecha
            <input
              value={date}
              onChange={(event) => setDate(event.target.value)}
              type="date"
              className="mt-2 w-full rounded-xl border border-black/10 px-3 py-3 text-[#1F2937] outline-[#3B82F6]"
            />
          </label>
          <label className="block text-sm font-bold text-[#1F2937]">
            Hora
            <input
              value={time}
              onChange={(event) => setTime(event.target.value)}
              type="time"
              className="mt-2 w-full rounded-xl border border-black/10 px-3 py-3 text-[#1F2937] outline-[#3B82F6]"
            />
          </label>
          <div>
            <p className="text-sm font-bold text-[#1F2937]">Duración</p>
            <div className="mt-2 grid grid-cols-2 gap-3">
              {(["60 min", "30 min"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setDuration(option)}
                  className={`rounded-xl border-2 py-3 font-bold ${
                    duration === option
                      ? "border-[#3B82F6] bg-[#DBEAFE] text-[#3B82F6]"
                      : "border-black/10 font-semibold text-[#1F2937]/50"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-[#1F2937]">Modalidad</p>
            <div className="mt-2 grid grid-cols-2 gap-3">
              {(["Virtual", "Presencial"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setModality(option)}
                  className={`rounded-xl border-2 py-3 font-bold ${
                    modality === option
                      ? "border-[#3B82F6] bg-[#DBEAFE] text-[#3B82F6]"
                      : "border-black/10 font-semibold text-[#1F2937]/50"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              onDone({
                duration,
                modality,
                timeLabel: `${formatDateLabel(date)} · ${formatTimeLabel(time)}`,
              })
            }
            className="w-full rounded-2xl bg-[#3B82F6] py-4 font-bold text-white shadow-lg shadow-blue-200"
          >
            Enviar propuesta
          </button>
        </div>
      </section>
      <BottomNav />
    </main>
  );
}

function ScheduleSuccess({
  candidate,
  details,
  onBack,
}: {
  candidate: MatchCandidate;
  details: { duration: string; modality: string };
  onBack: () => void;
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#F3F4F6] p-5 pb-28 text-center">
      <HomeLink className="absolute left-5 top-6" />
      <section className="w-full max-w-sm rounded-[2rem] bg-white p-8 shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#CCFBF1] text-[#14B8A6]">
          <Check size={32} />
        </div>
        <h1 className="mt-6 text-2xl font-bold">Propuesta enviada</h1>
        <p className="mt-2 leading-6 text-[#1F2937]/60">
          {candidate.name.split(" ")[0]} recibirá tu solicitud para una sesión {details.modality.toLowerCase()} de{" "}
          {details.duration}.
        </p>
        <div className="mt-7 space-y-3">
          <Link href="/profile" className="block w-full rounded-2xl bg-[#3B82F6] py-4 font-bold text-white">
            Ver en Perfil
          </Link>
          <button onClick={onBack} className="w-full rounded-2xl py-3 font-semibold text-[#1F2937]/50">
            Ver más perfiles
          </button>
        </div>
      </section>
      <BottomNav />
    </main>
  );
}

function EmptyMatches() {
  return (
    <div className="rounded-[2rem] bg-white p-10 text-center shadow-sm ring-1 ring-black/5">
      <Sparkles className="mx-auto text-[#3B82F6]" size={34} />
      <h2 className="mt-4 text-xl font-bold">Ya viste todos los perfiles</h2>
      <p className="mt-2 text-[#1F2937]/50">Vuelve pronto para descubrir nuevas personas compatibles.</p>
      <Link href="/home" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#3B82F6] px-5 py-3 font-bold text-white">
        <House size={18} /> Regresar a Inicio
      </Link>
    </div>
  );
}

function HomeLink({ className = "mb-5" }: { className?: string }) {
  return (
    <Link href="/home" className={`inline-flex items-center gap-2 text-sm font-semibold text-[#3B82F6] transition hover:text-[#2563EB] ${className}`}>
      <House size={18} /> Regresar a Inicio
    </Link>
  );
}

function formatDateLabel(value: string) {
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("es-GT", { weekday: "short", day: "numeric", month: "short" });
}

function formatTimeLabel(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return value;
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toLocaleTimeString("es-GT", { hour: "numeric", minute: "2-digit" });
}
