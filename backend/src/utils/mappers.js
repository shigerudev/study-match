export function mapUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    avatarUrl: row.avatar_url,
    role: row.role,
    bio: row.bio,
    career: row.career,
    subjects: row.subjects ?? [],
    goals: row.goals ?? [],
    availability: row.availability ?? [],
    level: row.level,
  };
}

export function mapSubject(row) {
  if (!row) return null;
  return { id: row.id, name: row.name, color: row.color };
}

export function mapPost(row, author, subject) {
  if (!row) return null;
  return {
    id: row.id,
    authorId: row.author_id,
    subjectId: row.subject_id,
    type: row.type,
    title: row.title,
    description: row.description,
    tags: row.tags ?? [],
    mediaUrl: row.media_url,
    status: row.status,
    createdAt: row.created_at,
    author: author ? mapUser(author) : undefined,
    subject: subject ? mapSubject(subject) : undefined,
  };
}

export function mapSwipe(row) {
  if (!row) return null;
  return {
    id: row.id,
    actorId: row.actor_id,
    targetId: row.target_id,
    decision: row.decision,
    createdAt: row.created_at,
  };
}

export function mapMatch(row) {
  if (!row) return null;
  return {
    id: row.id,
    userAId: row.user_a_id,
    userBId: row.user_b_id,
    score: row.score,
    reasons: row.reasons ?? [],
    status: row.status,
    createdAt: row.created_at,
  };
}

export function mapSession(row) {
  if (!row) return null;
  return {
    id: row.id,
    matchId: row.match_id,
    proposerId: row.proposer_id,
    scheduledAt: row.scheduled_at,
    durationMinutes: row.duration_minutes,
    modality: row.modality,
    status: row.status,
    createdAt: row.created_at,
  };
}

export function newId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
