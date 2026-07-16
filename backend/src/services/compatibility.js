/**
 * Compatibilidad explicable (SPECS §6), sobre 100:
 * materias 40 + objetivo 20 + disponibilidad 25 + nivel 15
 */

function overlap(a = [], b = []) {
  const setB = new Set(b.map((x) => String(x).toLowerCase()));
  return a.filter((x) => setB.has(String(x).toLowerCase()));
}

function availabilityOverlap(a = [], b = []) {
  const key = (item) =>
    typeof item === 'string'
      ? item.toLowerCase()
      : `${item.day ?? ''}|${item.slot ?? ''}`.toLowerCase();
  const setB = new Set(b.map(key));
  return a.filter((item) => setB.has(key(item)));
}

function hasCompatibleLevel(actor, target) {
  const targetById = new Map(
    (target.subjectDetails ?? []).map((subject) => [subject.id, subject.level]),
  );
  return (actor.subjectDetails ?? []).some((subject) => {
    const targetLevel = targetById.get(subject.id);
    return targetLevel !== undefined && Math.abs(subject.level - targetLevel) <= 1;
  });
}

export function computeCompatibility(actor, target) {
  const reasons = [];
  let score = 0;

  const sharedSubjects = overlap(actor.subjects, target.subjects);
  if (sharedSubjects.length) {
    score += 40;
    reasons.push(`Coinciden en ${sharedSubjects.slice(0, 2).join(' y ')}`);
  }

  const sharedGoals = overlap(actor.goals, target.goals);
  if (sharedGoals.length) {
    score += 20;
    reasons.push(`Objetivo: ${sharedGoals[0]}`);
  }

  const sharedSlots = availabilityOverlap(actor.availability, target.availability);
  if (sharedSlots.length) {
    score += 25;
    const slot =
      typeof sharedSlots[0] === 'string' ? sharedSlots[0] : sharedSlots[0].slot;
    reasons.push(`Disponibilidad compatible: ${slot}`);
  }

  if (hasCompatibleLevel(actor, target)) {
    score += 15;
    reasons.push('Sus niveles son compatibles');
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
