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

export const feedPosts: FeedPost[] = [
  {
    id: "post-1",
    author: "María López",
    avatar: "ML",
    subject: "Cálculo",
    type: "video",
    title: "Derivadas en 60 segundos: regla de la cadena",
    description: "Una guía visual para resolver derivadas compuestas sin perderte.",
    tags: ["derivadas", "cálculo-i"],
    views: "1.2K vistas",
    createdAt: "hace 2 h",
    artwork: "calculus",
  },
  {
    id: "post-2",
    author: "Diego Ramos",
    avatar: "DR",
    subject: "Programación",
    type: "video",
    title: "Arrays en JavaScript — explicándolos con post-its",
    description: "Recorre, filtra y transforma datos con ejemplos muy sencillos.",
    tags: ["javascript", "arrays"],
    views: "846 vistas",
    createdAt: "hace 4 h",
    artwork: "code",
  },
  {
    id: "post-3",
    author: "Valentina Cruz",
    avatar: "VC",
    subject: "Inglés",
    type: "foto",
    title: "15 phrasal verbs para sobrevivir a tu examen",
    description: "Mi chuleta visual con ejemplos cotidianos y pronunciación.",
    tags: ["vocabulario", "phrasal-verbs"],
    views: "602 guardados",
    createdAt: "ayer",
    artwork: "english",
  },
  {
    id: "post-4",
    author: "Sofía Hernández",
    avatar: "SH",
    subject: "Física",
    type: "foto",
    title: "Mapa mental: movimiento parabólico",
    description: "Las fórmulas y conceptos que sí debes recordar.",
    tags: ["cinemática", "física-i"],
    views: "421 guardados",
    createdAt: "ayer",
    artwork: "physics",
  },
  {
    id: "post-5",
    author: "Elena Torres",
    avatar: "ET",
    subject: "Diseño",
    type: "video",
    title: "Tip express: jerarquía visual en una presentación",
    description: "Haz que tu próxima entrega se entienda antes de leerla.",
    tags: ["presentaciones", "tipografía"],
    views: "319 vistas",
    createdAt: "hace 2 días",
    artwork: "design",
  },
  {
    id: "post-6",
    author: "Luis Mendoza",
    avatar: "LM",
    subject: "Cálculo",
    type: "foto",
    title: "Plantilla para estudiar límites",
    description: "Te comparto el orden que uso para resolver ejercicios paso a paso.",
    tags: ["límites", "plantilla"],
    views: "274 guardados",
    createdAt: "hace 3 días",
    artwork: "notes",
  },
];
