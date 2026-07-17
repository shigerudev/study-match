export type MatchCandidate = {
  id: string;
  name: string;
  initials: string;
  role: string;
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
  sharedSubject: string;
  isMutualMatch?: boolean;
};

export type ProfileData = {
  name: string;
  initials: string;
  role: string;
  career: string;
  bio: string;
  subjects: string[];
  availability: string;
};

export type ProfileSession = {
  id: string;
  person: string;
  initials: string;
  subject: string;
  time: string;
  duration: string;
  modality: string;
  status: "Pendiente" | "Aceptada" | "Cambio propuesto";
  accent: string;
};

/**
 * Deck alineado al seed: Lucía ya está omitida y Carlos ya es match activo.
 * Guion demo: omitir Diego → like a María.
 */
export const matchCandidates: MatchCandidate[] = [
  {
    id: "diego",
    name: "Diego Ramos",
    initials: "DR",
    role: "Diseñador y estudiante",
    intent: "ambos",
    intentLabel: "Aprende y enseña",
    career: "Diseño Digital",
    bio: "Diseñador y desarrollador; comparto recursos visuales y quiero mejorar en programación.",
    subjects: ["Programación", "Diseño"],
    goal: "Aprender programación y compartir recursos",
    availability: "Tarde · domingo",
    compatibility: 72,
    reasons: ["Comparte interés en Programación", "Disponibilidad de tarde"],
    accent: "from-cyan-400 to-blue-600",
    sharedSubject: "Programación",
  },
  {
    id: "maria",
    name: "María López",
    initials: "ML",
    role: "Mentora y estudiante",
    intent: "ambos",
    intentLabel: "Aprende y enseña",
    career: "Ingeniería Industrial",
    bio: "Mentora de cálculo. Me gustan las sesiones cortas con ejercicios prácticos.",
    subjects: ["Cálculo", "Programación"],
    goal: "Enseñar Cálculo I y practicar ejercicios",
    availability: "Tarde · martes",
    compatibility: 92,
    reasons: ["Coinciden en Cálculo", "Disponibilidad por la tarde"],
    accent: "from-[#3B82F6] to-[#14B8A6]",
    sharedSubject: "Cálculo",
    isMutualMatch: true,
  },
];

let profileState: ProfileData = {
  name: "Sofía Martínez",
  initials: "SM",
  role: "Estudiante",
  career: "Ingeniería en Sistemas",
  bio: "Estudio Ingeniería y aprendo mejor resolviendo ejercicios en equipo.",
  subjects: ["Cálculo", "Inglés"],
  availability: "Tarde · sábado",
};

const profileListeners = new Set<() => void>();

function notifyProfile() {
  profileListeners.forEach((listener) => listener());
}

export function getProfile() {
  return profileState;
}

export function subscribeProfile(listener: () => void) {
  profileListeners.add(listener);
  return () => {
    profileListeners.delete(listener);
  };
}

export function updateProfile(patch: Partial<ProfileData>) {
  profileState = { ...profileState, ...patch };
  if (patch.name) {
    const parts = patch.name.trim().split(/\s+/);
    profileState.initials = parts.map((part) => part[0]?.toUpperCase() ?? "").join("").slice(0, 2) || "SM";
  }
  notifyProfile();
}

/** Publicaciones de Sofía en el seed (post …0202). */
export const profilePosts = [
  {
    id: "00000000-0000-4000-8000-000000000202",
    subject: "Inglés",
    type: "Foto",
    title: "Mis conectores favoritos",
    views: "486",
    accent: "from-amber-400 to-orange-600",
  },
];

const statusAccent: Record<ProfileSession["status"], string> = {
  Pendiente: "bg-[#DBEAFE] text-[#3B82F6]",
  Aceptada: "bg-[#CCFBF1] text-[#0F766E]",
  "Cambio propuesto": "bg-[#FEF3C7] text-[#B45309]",
};

/** Sesiones seed Sofía ↔ Carlos (…0401 pendiente, …0402 aceptada). */
let sessionsState: ProfileSession[] = [
  {
    id: "00000000-0000-4000-8000-000000000401",
    person: "Carlos Reyes",
    initials: "CR",
    subject: "Cálculo",
    time: "Sáb 18 jul · 4:00 pm",
    duration: "60 min",
    modality: "Virtual",
    status: "Pendiente",
    accent: statusAccent.Pendiente,
  },
  {
    id: "00000000-0000-4000-8000-000000000402",
    person: "Carlos Reyes",
    initials: "CR",
    subject: "Cálculo",
    time: "Lun 20 jul · 4:00 pm",
    duration: "30 min",
    modality: "Virtual",
    status: "Aceptada",
    accent: statusAccent.Aceptada,
  },
];

const sessionListeners = new Set<() => void>();

function notifySessions() {
  sessionListeners.forEach((listener) => listener());
}

export function getProfileSessions() {
  return sessionsState;
}

export function subscribeSessions(listener: () => void) {
  sessionListeners.add(listener);
  return () => {
    sessionListeners.delete(listener);
  };
}

export function addPendingSession(input: {
  person: string;
  initials: string;
  subject: string;
  time: string;
  duration: string;
  modality: string;
}) {
  sessionsState = [
    {
      id: `session-${Date.now()}`,
      ...input,
      status: "Pendiente",
      accent: statusAccent.Pendiente,
    },
    ...sessionsState,
  ];
  notifySessions();
}

export function updateSessionStatus(id: string, status: ProfileSession["status"]) {
  sessionsState = sessionsState.map((session) =>
    session.id === id ? { ...session, status, accent: statusAccent[status] } : session,
  );
  notifySessions();
}

/** Guardado seed: Sofía → post de María “…0201”. */
export const savedPosts = [
  {
    id: "00000000-0000-4000-8000-000000000201",
    author: "María López",
    subject: "Cálculo",
    title: "Derivadas en 60 segundos",
    accent: "from-[#3B82F6] to-[#14B8A6]",
  },
];
