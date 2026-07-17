export type Subject = "Todo" | "Cálculo" | "Inglés" | "Física" | "Programación" | "Diseño";

export type FeedPost = {
  id: string;
  author: string;
  avatar: string;
  subject: Exclude<Subject, "Todo">;
  type: "video" | "foto";
  title: string;
  description: string;
  tags: string[];
  views: string;
  createdAt: string;
  artwork: "calculus" | "english" | "physics" | "code" | "design" | "notes";
};

export const subjects: Subject[] = ["Todo", "Cálculo", "Inglés", "Física", "Programación", "Diseño"];

/** Publicaciones alineadas a supabase/seed.sql (…0201–…0206). */
const seedPosts: FeedPost[] = [
  {
    id: "00000000-0000-4000-8000-000000000201",
    author: "María López",
    avatar: "ML",
    subject: "Cálculo",
    type: "video",
    title: "Derivadas en 60 segundos",
    description: "Regla de la potencia explicada con un ejemplo rápido.",
    tags: ["derivadas", "calculo-1"],
    views: "1.2K vistas",
    createdAt: "hace 2 h",
    artwork: "calculus",
  },
  {
    id: "00000000-0000-4000-8000-000000000202",
    author: "Sofía Martínez",
    avatar: "SM",
    subject: "Inglés",
    type: "foto",
    title: "Mis conectores favoritos",
    description: "Una guía visual para enlazar ideas en inglés.",
    tags: ["grammar", "writing"],
    views: "602 guardados",
    createdAt: "hace 3 h",
    artwork: "english",
  },
  {
    id: "00000000-0000-4000-8000-000000000203",
    author: "Carlos Reyes",
    avatar: "CR",
    subject: "Física",
    type: "video",
    title: "Vectores sin fórmulas largas",
    description: "Cómo visualizar dirección, magnitud y sentido.",
    tags: ["vectores", "mecanica"],
    views: "846 vistas",
    createdAt: "hace 4 h",
    artwork: "physics",
  },
  {
    id: "00000000-0000-4000-8000-000000000204",
    author: "Diego Ramos",
    avatar: "DR",
    subject: "Programación",
    type: "foto",
    title: "Mapa mental de estructuras de datos",
    description: "Una chuleta para elegir la estructura adecuada.",
    tags: ["algoritmos", "estructuras"],
    views: "421 guardados",
    createdAt: "ayer",
    artwork: "code",
  },
  {
    id: "00000000-0000-4000-8000-000000000205",
    author: "Diego Ramos",
    avatar: "DR",
    subject: "Diseño",
    type: "foto",
    title: "Jerarquía visual para principiantes",
    description: "Tres ajustes que hacen más clara cualquier composición.",
    tags: ["tipografia", "ui"],
    views: "319 vistas",
    createdAt: "hace 2 días",
    artwork: "design",
  },
  {
    id: "00000000-0000-4000-8000-000000000206",
    author: "María López",
    avatar: "ML",
    subject: "Cálculo",
    type: "foto",
    title: "Límites: método paso a paso",
    description: "Ejercicio resuelto para practicar antes del parcial.",
    tags: ["limites", "ejercicios"],
    views: "274 guardados",
    createdAt: "hace 3 días",
    artwork: "notes",
  },
];

/** Lista mutable del feed mock (demo local). Preferir getFeedPosts / addFeedPost. */
export let feedPosts: FeedPost[] = [...seedPosts];

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export function getFeedPosts() {
  return feedPosts;
}

export function subscribeFeed(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function addFeedPost(input: {
  title: string;
  subject: Exclude<Subject, "Todo">;
  type: "video" | "foto";
  description?: string;
}) {
  const artworkBySubject: Record<Exclude<Subject, "Todo">, FeedPost["artwork"]> = {
    Cálculo: "calculus",
    Inglés: "english",
    Física: "physics",
    Programación: "code",
    Diseño: "design",
  };

  const post: FeedPost = {
    id: `local-${Date.now()}`,
    author: "Sofía Martínez",
    avatar: "SM",
    subject: input.subject,
    type: input.type,
    title: input.title,
    description: input.description?.trim() || "Publicación de demostración en StudyMatch.",
    tags: [input.subject.toLocaleLowerCase("es")],
    views: "Recién publicada",
    createdAt: "ahora",
    artwork: artworkBySubject[input.subject],
  };

  feedPosts = [post, ...feedPosts];
  notify();
  return post;
}
