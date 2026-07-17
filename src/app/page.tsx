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
          <p className="mt-4 text-sm text-[#1F2937]/55">Tu espacio para aprender mejor, en comunidad.</p>
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
