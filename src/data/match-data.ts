export type MatchCandidate = {
  id: string;
  name: string;
  initials: string;
  role: string;
  /** Intención visible en la tarjeta: aprender, enseñar o ambos. */
  intent: "aprender" | "enseñar" | "ambos";
  intentLabel: string;
  career: string;
  bio: string;
  subjects: string[];
  goal: string;
  availability: string;
  compatibility: number;
  reasons: string[];
  accent: string;
  isMutualMatch?: boolean;
};

export const matchCandidates: MatchCandidate[] = [
  {
    id: "diego",
    name: "Diego Ramírez",
    initials: "DR",
    role: "Estudiante",
    intent: "aprender",
    intentLabel: "Solo busca aprender",
    career: "Ingeniería en Sistemas",
    bio: "Empiezo Física I y necesito a alguien paciente para resolver ejercicios juntos. No enseño todavía.",
    subjects: ["Física", "Programación"],
    goal: "Aprobar el parcial de Física I",
    availability: "Lun y mié · 6:00 pm",
    compatibility: 78,
    reasons: ["Coinciden en horario de tarde", "Ambos estudian ingeniería"],
    accent: "from-cyan-400 to-blue-600",
  },
  {
    id: "lucia",
    name: "Lucía Pérez",
    initials: "LP",
    role: "Estudiante",
    intent: "aprender",
    intentLabel: "Solo busca aprender",
    career: "Comunicación",
    bio: "Quiero ganar confianza al hablar en inglés. Busco práctica, no estoy lista para enseñar.",
    subjects: ["Inglés"],
    goal: "Practicar speaking dos veces por semana",
    availability: "Vie · 7:00–9:00 pm",
    compatibility: 81,
    reasons: ["Objetivo de conversación en común", "Disponibilidad nocturna"],
    accent: "from-sky-400 to-indigo-500",
  },
  {
    id: "maria",
    name: "María López",
    initials: "ML",
    role: "Mentora y estudiante",
    intent: "ambos",
    intentLabel: "Aprende y enseña",
    career: "Ingeniería Industrial",
    bio: "Te ayudo con Cálculo I y, a cambio, busco practicar inglés cada semana.",
    subjects: ["Cálculo I", "Inglés"],
    goal: "Enseñar integrales y practicar conversación",
    availability: "Mar y jue · 4:00–7:00 pm",
    compatibility: 92,
    reasons: ["Coinciden en Cálculo I", "Disponibilidad por la tarde"],
    accent: "from-violet-400 to-fuchsia-600",
    isMutualMatch: true,
  },
  {
    id: "andre",
    name: "André Castillo",
    initials: "AC",
    role: "Ambos",
    intent: "ambos",
    intentLabel: "Aprende y enseña",
    career: "Ciencias de la Computación",
    bio: "Enseño Python a principiantes y yo estoy reforzando Cálculo para el examen de admisión a maestría.",
    subjects: ["Programación", "Cálculo I"],
    goal: "Mentorear bucles y dominar límites",
    availability: "Sáb · 10:00 am–1:00 pm",
    compatibility: 88,
    reasons: ["Comparte Programación y Cálculo", "Nivel compatible"],
    accent: "from-emerald-400 to-teal-600",
  },
  {
    id: "valeria",
    name: "Valeria Méndez",
    initials: "VM",
    role: "Profesora",
    intent: "enseñar",
    intentLabel: "Principalmente enseña",
    career: "Física Aplicada",
    bio: "Profesora auxiliar. Ofrezco sesiones cortas de mecánica y vectores para quien va empezando.",
    subjects: ["Física"],
    goal: "Acompañar a estudiantes de primer año",
    availability: "Mar y jue · 5:00–7:00 pm",
    compatibility: 74,
    reasons: ["Puede enseñar Física", "Horario de tarde compatible"],
    accent: "from-rose-400 to-orange-500",
  },
  {
    id: "camila",
    name: "Camila Torres",
    initials: "CT",
    role: "Profesora",
    intent: "enseñar",
    intentLabel: "Principalmente enseña",
    career: "Diseño Gráfico",
    bio: "Comparto recursos para convertir ideas complejas en visuales claros. Abierta a mentorías de UI.",
    subjects: ["Diseño", "Presentaciones"],
    goal: "Guiar portafolios de diseño",
    availability: "Vie · 3:00–6:00 pm",
    compatibility: 65,
    reasons: ["Objetivos creativos afines", "Prefieren sesiones cortas"],
    accent: "from-orange-300 to-rose-500",
  },
  {
    id: "kevin",
    name: "Kevin Soto",
    initials: "KS",
    role: "Estudiante",
    intent: "aprender",
    intentLabel: "Solo busca aprender",
    career: "Administración",
    bio: "Nunca había programado. Busco a alguien que explique desde cero, sin presión.",
    subjects: ["Programación"],
    goal: "Entender variables y funciones",
    availability: "Dom · 4:00–6:00 pm",
    compatibility: 70,
    reasons: ["Busca apoyo en Programación", "Sesiones de fin de semana"],
    accent: "from-lime-400 to-green-600",
  },
  {
    id: "elena",
    name: "Elena Ruiz",
    initials: "ER",
    role: "Ambos",
    intent: "ambos",
    intentLabel: "Aprende y enseña",
    career: "Lingüística",
    bio: "Enseño inglés conversacional y estoy aprendiendo tipografía básica para mis materiales de clase.",
    subjects: ["Inglés", "Diseño"],
    goal: "Intercambiar speaking por feedback de diseño",
    availability: "Mié · 6:00–8:00 pm",
    compatibility: 84,
    reasons: ["Intercambio de enseñanza", "Coinciden en Inglés"],
    accent: "from-fuchsia-400 to-purple-600",
  },
];

export const profile = {
  name: "Sofía Herrera",
  initials: "SH",
  role: "Estudiante de Ingeniería",
  career: "Universidad de Guatemala",
  bio: "Aprendo mejor compartiendo apuntes, ejercicios y una buena conversación.",
  subjects: ["Cálculo I", "Inglés", "Programación"],
  availability: "Mar y jue · tardes",
};

export const profilePosts = [
  { id: "post-1", subject: "Cálculo I", type: "Video", title: "Integrales por sustitución en 3 pasos", views: "1.2k", accent: "from-violet-500 to-indigo-700" },
  { id: "post-2", subject: "Inglés", type: "Foto", title: "Mi guía de phrasal verbs", views: "486", accent: "from-amber-400 to-orange-600" },
  { id: "post-3", subject: "Programación", type: "Video", title: "Cómo entender un loop", views: "789", accent: "from-cyan-400 to-blue-700" },
];

export const profileSessions = [
  { id: "session-1", person: "María López", initials: "ML", subject: "Cálculo I", time: "Hoy · 5:00 pm", duration: "60 min", modality: "Virtual", status: "Pendiente", accent: "bg-violet-100 text-violet-700" },
  { id: "session-2", person: "Daniel Cruz", initials: "DC", subject: "Inglés conversacional", time: "Vie · 4:30 pm", duration: "30 min", modality: "Virtual", status: "Aceptada", accent: "bg-emerald-100 text-emerald-700" },
];

export const savedPosts = [
  { id: "saved-1", author: "Valeria M.", subject: "Física", title: "Resumen: leyes de Newton", accent: "from-rose-400 to-pink-600" },
  { id: "saved-2", author: "Pablo G.", subject: "Programación", title: "Array methods que sí usarás", accent: "from-teal-400 to-cyan-700" },
];
