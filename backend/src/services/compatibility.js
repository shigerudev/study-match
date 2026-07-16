/**
 * Compatibilidad explicable (SPECS §6 / public.match_score), sobre 100:
 * materias 40 + objetivo 20 + disponibilidad 25 + nivel 15
 */

function normalizeAvailability(item) {
  return typeof item === 'string'
    ? item.toLowerCase()
    : String(item.slot ?? item.day ?? '').toLowerCase();
}

function overlapExactInsensitive(a = [], b = []) {
  const setB = new Set(b.map((x) => String(x).toLowerCase()));
  return a.filter((x) => setB.has(String(x).toLowerCase()));
}

function availabilityOverlap(a = [], b = []) {
  const setB = new Set(b.map(normalizeAvailability));
  return a.filter((item) => setB.has(normalizeAvailability(item)));
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

  const sharedSubjects = overlapExactInsensitive(actor.subjects, target.subjects);
  if (sharedSubjects.length) {
    score += 40;
    reasons.push(`Coinciden en ${sharedSubjects.slice(0, 2).join(', ')}`);
  }

  const sharedGoals = overlapExactInsensitive(actor.goals, target.goals);
  if (sharedGoals.length) {
    score += 20;
    reasons.push('Tienen un objetivo de estudio en común');
  }

  const sharedSlots = availabilityOverlap(actor.availability ?? [], target.availability ?? []);
  if (sharedSlots.length) {
    score += 25;
    reasons.push('Comparten disponibilidad');
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
