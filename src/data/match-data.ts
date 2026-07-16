export type MatchCandidate = {
  id: string;
  name: string;
  initials: string;
  role: string;
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
    career: "Ingeniería en Sistemas",
    bio: "Me gusta resolver ejercicios paso a paso y preparar exámenes en equipo.",
    subjects: ["Física", "Programación"],
    goal: "Preparar el parcial de Física I",
    availability: "Lun y mié · 6:00 pm",
    compatibility: 78,
    reasons: ["Coinciden en horario de tarde", "Ambos estudian ingeniería"],
    accent: "from-cyan-400 to-blue-600",
  },
  {
    id: "maria",
    name: "María López",
    initials: "ML",
    role: "Mentora y estudiante",
    career: "Ingeniería Industrial",
    bio: "Te ayudo a que Cálculo I tenga sentido. Busco practicar inglés cada semana.",
    subjects: ["Cálculo I", "Inglés"],
    goal: "Resolver integrales y practicar conversación",
    availability: "Mar y jue · 4:00–7:00 pm",
    compatibility: 92,
    reasons: ["Coinciden en Cálculo I", "Disponibilidad por la tarde"],
    accent: "from-violet-400 to-fuchsia-600",
    isMutualMatch: true,
  },
  {
    id: "camila",
    name: "Camila Torres",
    initials: "CT",
    role: "Profesora",
    career: "Diseño Gráfico",
    bio: "Comparto recursos para convertir ideas complejas en visuales claros.",
    subjects: ["Diseño", "Presentaciones"],
    goal: "Preparar un portafolio",
    availability: "Vie · 3:00–6:00 pm",
    compatibility: 65,
    reasons: ["Objetivos creativos afines", "Prefieren sesiones cortas"],
    accent: "from-orange-300 to-rose-500",
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
