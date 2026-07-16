export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f7fc] px-6 font-sans text-[#26235d]">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm ring-1 ring-[#e7e5f2]">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#ff786b]">
          MVP en preparación
        </p>
        <h1 className="text-4xl font-bold tracking-tight">StudyMatch</h1>
        <p className="mt-3 text-lg leading-7 text-[#6d6a91]">Aprende acompañado.</p>
        <div className="mt-8 rounded-2xl bg-[#f5f4ff] p-5">
          <p className="font-semibold">Siguiente paso</p>
          <p className="mt-1 text-sm leading-6 text-[#6d6a91]">
            Autorizar Supabase y Vercel, configurar las variables de entorno y crear el esquema inicial.
          </p>
        </div>
      </section>
    </main>
  );
}
