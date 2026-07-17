import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, HeartHandshake, Sparkles } from "lucide-react";

export default function WelcomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F3F4F6] text-[#1F2937]">
      <section className="relative mx-auto flex min-h-screen max-w-[480px] flex-col items-center justify-center px-6 py-10 text-center">
        <div className="absolute -left-24 top-16 h-52 w-52 rounded-full bg-[#3B82F6]/15 blur-3xl" />
        <div className="absolute -right-24 bottom-20 h-60 w-60 rounded-full bg-[#14B8A6]/15 blur-3xl" />

        <div className="relative w-full">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FBBF24] text-[#1F2937] shadow-lg shadow-[#FBBF24]/30">
            <Sparkles size={24} />
          </div>

          <Image
            src="/brand/studymatch-logo.png"
            alt="StudyMatch"
            width={360}
            height={360}
            priority
            className="mx-auto mt-4 h-auto w-full max-w-[330px] object-contain"
          />

          <p className="mx-auto -mt-8 max-w-[300px] text-lg font-semibold leading-7 text-[#1F2937]">
            Aprende acompañado. Conecta, comparte y encuentra tu equipo de estudio.
          </p>

          <div className="mt-9 grid grid-cols-3 gap-2 text-left">
            <Feature icon={<BookOpen size={18} />} text="Explora clases" color="bg-[#3B82F6]" />
            <Feature icon={<HeartHandshake size={18} />} text="Haz match" color="bg-[#14B8A6]" />
            <Feature icon={<Sparkles size={18} />} text="Comparte" color="bg-[#FBBF24]" />
          </div>

          <Link
            href="/home"
            className="mt-9 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#3B82F6] px-5 py-4 text-base font-bold text-white shadow-lg shadow-[#3B82F6]/25 transition hover:bg-[#2563EB] focus:outline-none focus:ring-4 focus:ring-[#3B82F6]/25"
          >
            Entrar a StudyMatch <ArrowRight size={20} />
          </Link>

          <section className="mt-10 rounded-3xl border border-white/80 bg-white/80 p-6 text-left shadow-xl shadow-[#1F2937]/5 backdrop-blur" aria-labelledby="pitch-title">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#14B8A6]">La idea</p>
            <h2 id="pitch-title" className="mt-2 text-2xl font-extrabold tracking-tight text-[#1F2937]">
              Estudiar no debería sentirse como hacerlo solo.
            </h2>
            <p className="mt-3 text-[15px] leading-6 text-[#1F2937]/70">
              StudyMatch conecta estudiantes y profesores según sus materias, objetivos y horarios. Así, encontrar a la persona indicada para aprender deja de depender de grupos dispersos y mensajes sin contexto.
            </p>

            <div className="mt-5 grid gap-3">
              <PitchPoint number="01" title="Descubre" description="Explora videos, apuntes y recursos por clase." color="bg-[#3B82F6]" />
              <PitchPoint number="02" title="Conecta" description="Haz match con personas compatibles para estudiar." color="bg-[#14B8A6]" />
              <PitchPoint number="03" title="Avanza" description="Agenda una sesión y transforma interés en progreso." color="bg-[#FBBF24]" darkText />
            </div>
          </section>

          <p className="mt-6 text-sm text-[#1F2937]/55">Tu espacio para aprender mejor, en comunidad.</p>
        </div>
      </section>
    </main>
  );
}

function Feature({ icon, text, color }: { icon: React.ReactNode; text: string; color: string }) {
  return (
    <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5">
      <span className={`grid h-8 w-8 place-items-center rounded-xl text-white ${color}`}>{icon}</span>
      <p className="mt-2 text-xs font-bold leading-4 text-[#1F2937]">{text}</p>
    </div>
  );
}

function PitchPoint({ number, title, description, color, darkText = false }: { number: string; title: string; description: string; color: string; darkText?: boolean }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-[#F3F4F6] p-3">
      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-xs font-black ${color} ${darkText ? "text-[#1F2937]" : "text-white"}`}>{number}</span>
      <p className="text-sm leading-5 text-[#1F2937]/70"><strong className="text-[#1F2937]">{title}.</strong> {description}</p>
    </div>
  );
}
