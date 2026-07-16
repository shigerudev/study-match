"use client";

import { CheckCircle2, ImagePlus, Video } from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

const subjects = ["Cálculo", "Inglés", "Física", "Programación", "Diseño"];

export default function CreatePostPage() {
  const [type, setType] = useState<"photo" | "video">("photo");
  const [published, setPublished] = useState(false);

  function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPublished(true);
  }

  return (
    <main className="min-h-screen bg-[#f7f7fc] px-5 py-8 text-[#26235d] sm:py-12">
      <section className="mx-auto max-w-xl">
        <Link className="text-sm font-semibold text-[#302e8e]" href="/">
          ← Volver a Inicio
        </Link>
        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.14em] text-[#ff786b]">Comunidad</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Crear publicación</h1>
        <p className="mt-2 leading-6 text-[#6d6a91]">Comparte un recurso breve que ayude a alguien a aprender.</p>

        {published ? (
          <div className="mt-8 rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-[#e7e5f2]">
            <CheckCircle2 className="mx-auto h-12 w-12 text-[#25a777]" aria-hidden="true" />
            <h2 className="mt-4 text-xl font-bold">¡Publicación lista!</h2>
            <p className="mt-2 text-sm leading-6 text-[#6d6a91]">En este MVP se guardó como contenido local de demostración.</p>
            <Link className="mt-6 inline-flex rounded-full bg-[#302e8e] px-5 py-3 text-sm font-semibold text-white" href="/">
              Ver el feed
            </Link>
          </div>
        ) : (
          <form className="mt-8 space-y-5 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[#e7e5f2]" onSubmit={publish}>
            <fieldset>
              <legend className="text-sm font-semibold">Tipo de publicación</legend>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <button
                  className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-4 text-sm font-semibold ${type === "photo" ? "border-[#302e8e] bg-[#efedff] text-[#302e8e]" : "border-[#e7e5f2] text-[#6d6a91]"}`}
                  type="button"
                  onClick={() => setType("photo")}
                >
                  <ImagePlus className="h-5 w-5" aria-hidden="true" /> Foto
                </button>
                <button
                  className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-4 text-sm font-semibold ${type === "video" ? "border-[#302e8e] bg-[#efedff] text-[#302e8e]" : "border-[#e7e5f2] text-[#6d6a91]"}`}
                  type="button"
                  onClick={() => setType("video")}
                >
                  <Video className="h-5 w-5" aria-hidden="true" /> Video corto
                </button>
              </div>
            </fieldset>

            <label className="block text-sm font-semibold">
              Título
              <input required className="mt-2 w-full rounded-xl border border-[#d9d8ec] px-4 py-3 font-normal outline-none focus:border-[#302e8e]" placeholder="Ej. Derivadas en 60 segundos" />
            </label>

            <label className="block text-sm font-semibold">
              Clase
              <select required className="mt-2 w-full rounded-xl border border-[#d9d8ec] bg-white px-4 py-3 font-normal outline-none focus:border-[#302e8e]" defaultValue="">
                <option disabled value="">Selecciona una clase</option>
                {subjects.map((subject) => <option key={subject}>{subject}</option>)}
              </select>
            </label>

            <label className="block text-sm font-semibold">
              Descripción <span className="font-normal text-[#6d6a91]">(opcional)</span>
              <textarea className="mt-2 min-h-24 w-full rounded-xl border border-[#d9d8ec] px-4 py-3 font-normal outline-none focus:border-[#302e8e]" placeholder="¿Qué aprenderá la comunidad?" />
            </label>

            <div className="rounded-2xl border border-dashed border-[#b4b1db] bg-[#f5f4ff] px-4 py-7 text-center text-sm text-[#6d6a91]">
              Previsualización de {type === "photo" ? "foto" : "video"} para la demo
            </div>
            <button className="w-full rounded-full bg-[#ff786b] px-5 py-3 font-semibold text-white" type="submit">Publicar</button>
          </form>
        )}
      </section>
    </main>
  );
}
