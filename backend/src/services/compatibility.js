/**
 * Compatibilidad explicable (SPECS §6), sobre 100:
 * materias 40 + objetivo 20 + disponibilidad 25 + nivel 15
 */

function overlap(a = [], b = []) {
  const setB = new Set(b.map((x) => String(x).toLowerCase()));
  return a.filter((x) => setB.has(String(x).toLowerCase()));
}

function availabilityOverlap(a = [], b = []) {
  const key = (item) => `${item.day}|${item.slot}`;
  const setB = new Set(b.map(key));
  return a.filter((item) => setB.has(key(item)));
}

const LEVEL_ORDER = { basico: 1, intermedio: 2, avanzado: 3 };

export function computeCompatibility(actor, target) {
  const reasons = [];
  let score = 0;

  const sharedSubjects = overlap(actor.subjects, target.subjects);
  if (sharedSubjects.length) {
    const points = Math.min(40, sharedSubjects.length * 20);
    score += points;
    reasons.push(`Coinciden en ${sharedSubjects.slice(0, 2).join(' y ')}`);
  }

  const sharedGoals = overlap(actor.goals, target.goals);
  if (sharedGoals.length) {
    score += Math.min(20, sharedGoals.length * 10);
    reasons.push(`Objetivo: ${sharedGoals[0]}`);
  } else if (
    actor.goals?.some((g) => /enseñar|mentor/i.test(g)) ||
    target.goals?.some((g) => /enseñar|mentor/i.test(g))
  ) {
    score += 10;
    reasons.push('Objetivo compatible de enseñanza/aprendizaje');
  }

  const sharedSlots = availabilityOverlap(actor.availability, target.availability);
  if (sharedSlots.length) {
    score += Math.min(25, sharedSlots.length * 15);
    const slot = sharedSlots[0].slot;
    reasons.push(`Disponibilidad por la ${slot}`);
  }

  const la = LEVEL_ORDER[actor.level] ?? 2;
  const lb = LEVEL_ORDER[target.level] ?? 2;
  const levelDiff = Math.abs(la - lb);
  if (levelDiff === 0) {
    score += 15;
    reasons.push('Mismo nivel');
  } else if (levelDiff === 1) {
    score += 10;
    reasons.push('Nivel compatible');
  }

  return {
    score: Math.min(100, score),
    reasons: reasons.length ? reasons : ['Perfiles potencialmente afines'],
  };
}

export function orderedPair(userIdA, userIdB) {
  return userIdA < userIdB
    ? { user_a_id: userIdA, user_b_id: userIdB }
    : { user_a_id: userIdB, user_b_id: userIdA };
}
