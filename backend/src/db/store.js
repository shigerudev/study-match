import { supabase } from './supabase.js';

const PROFILE_SELECT = `
  *,
  profile_subjects (
    level,
    is_teaching,
    subject:subjects (id, name, slug, color)
  )
`;

const POST_SELECT = `
  *,
  author:profiles!posts_author_id_fkey (
    *,
    profile_subjects (
      level,
      is_teaching,
      subject:subjects (id, name, slug, color)
    )
  ),
  subject:subjects!posts_subject_id_fkey (id, name, slug, color)
`;

function dbError(error) {
  const statusByCode = {
    '22P02': 400,
    '23503': 400,
    '23505': 409,
    '23514': 400,
  };
  return Object.assign(new Error(error.message), {
    status: statusByCode[error.code] ?? 500,
  });
}

function assertNoError(error) {
  if (error) throw dbError(error);
}

function normalizeProfile(row) {
  if (!row) return null;

  const subjectDetails = (row.profile_subjects ?? [])
    .filter((item) => item.subject)
    .map((item) => ({
      id: item.subject.id,
      name: item.subject.name,
      slug: item.subject.slug,
      color: item.subject.color,
      level: item.level,
      isTeaching: item.is_teaching,
    }));

  return {
    ...row,
    subjects: subjectDetails.map((subject) => subject.name),
    subjectDetails,
  };
}

export async function listSubjects() {
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .order('name', { ascending: true });
  assertNoError(error);
  return data ?? [];
}

export async function getUser(id) {
  const { data, error } = await supabase
    .from('profiles')
    .select(PROFILE_SELECT)
    .eq('id', id)
    .maybeSingle();
  assertNoError(error);
  return normalizeProfile(data);
}

async function resolveSubjects(subjects) {
  const { data, error } = await supabase.from('subjects').select('id, name');
  assertNoError(error);

  const available = data ?? [];
  return subjects.map((subject) => {
    const input = typeof subject === 'string' ? { id: subject, name: subject } : subject;
    const found = available.find(
      (candidate) =>
        candidate.id === input.id ||
        candidate.name.toLowerCase() === String(input.name ?? '').toLowerCase(),
    );

    if (!found) {
      throw Object.assign(new Error(`Materia no encontrada: ${input.name ?? input.id}`), {
        status: 400,
      });
    }

    const level = Number(input.level ?? 3);
    if (!Number.isInteger(level) || level < 1 || level > 5) {
      throw Object.assign(new Error('El nivel de materia debe estar entre 1 y 5'), {
        status: 400,
      });
    }

    return {
      subject_id: found.id,
      level,
      is_teaching: Boolean(input.isTeaching),
    };
  });
}

export async function updateUser(id, updates) {
  const current = await getUser(id);
  if (!current) return null;

  const { subjects, ...profileUpdates } = updates;

  if (Object.keys(profileUpdates).length) {
    const { error } = await supabase.from('profiles').update(profileUpdates).eq('id', id);
    assertNoError(error);
  }

  if (subjects) {
    const resolved = await resolveSubjects(subjects);

    const { error: deleteError } = await supabase
      .from('profile_subjects')
      .delete()
      .eq('profile_id', id);
    assertNoError(deleteError);

    const { error: insertError } = await supabase.from('profile_subjects').insert(
      resolved.map((subject) => ({
        profile_id: id,
        ...subject,
      })),
    );
    assertNoError(insertError);
  }

  return getUser(id);
}

export async function listPosts({ subject, q, authorId } = {}) {
  let query = supabase
    .from('posts')
    .select(POST_SELECT)
    .eq('status', 'publicada')
    .order('created_at', { ascending: false });

  if (authorId) {
    query = query.eq('author_id', authorId);
  }

  if (subject && subject !== 'Todo') {
    const { data: matchedSubjects, error } = await supabase
      .from('subjects')
      .select('id')
      .ilike('name', subject);
    assertNoError(error);

    const ids = (matchedSubjects ?? []).map((item) => item.id);
    if (!ids.length) return [];
    query = query.in('subject_id', ids);
  }

  const { data, error } = await query;
  assertNoError(error);

  let posts = (data ?? []).map((post) => ({
    ...post,
    author: normalizeProfile(post.author),
  }));

  if (q && String(q).trim()) {
    const term = String(q).trim().toLowerCase();
    posts = posts.filter((post) =>
      [
        post.title,
        post.description,
        ...(post.tags ?? []),
        post.subject?.name,
        post.author?.name,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(term),
    );
  }

  return posts;
}

export async function listSavedPostsForUser(userId) {
  const { data, error } = await supabase
    .from('saved_posts')
    .select(`created_at, post:posts!saved_posts_post_id_fkey (${POST_SELECT})`)
    .eq('profile_id', userId)
    .order('created_at', { ascending: false });
  assertNoError(error);

  return (data ?? [])
    .filter((item) => item.post)
    .map((item) => ({
      ...item.post,
      saved_at: item.created_at,
      author: normalizeProfile(item.post.author),
    }));
}

export async function createPost(row) {
  const { data, error } = await supabase
    .from('posts')
    .insert(row)
    .select(POST_SELECT)
    .single();
  assertNoError(error);
  return {
    ...data,
    author: normalizeProfile(data.author),
  };
}

export async function listUsers() {
  const { data, error } = await supabase
    .from('profiles')
    .select(PROFILE_SELECT)
    .order('name', { ascending: true });
  assertNoError(error);
  return (data ?? []).map(normalizeProfile);
}

export async function listSwipesByActor(actorId) {
  const { data, error } = await supabase
    .from('swipes')
    .select('*')
    .eq('actor_id', actorId);
  assertNoError(error);
  return data ?? [];
}

export async function findSwipe(actorId, targetId) {
  const { data, error } = await supabase
    .from('swipes')
    .select('*')
    .eq('actor_id', actorId)
    .eq('target_id', targetId)
    .maybeSingle();
  assertNoError(error);
  return data;
}

export async function createSwipe(row) {
  const { data, error } = await supabase.from('swipes').insert(row).select('*').single();
  assertNoError(error);
  return data;
}

export async function findMatchPair(userAId, userBId) {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .eq('user_a_id', userAId)
    .eq('user_b_id', userBId)
    .maybeSingle();
  assertNoError(error);
  return data;
}

export async function createMatch(row) {
  const { data, error } = await supabase.from('matches').insert(row).select('*').single();
  assertNoError(error);
  return data;
}

export async function updateMatch(id, updates) {
  const { data, error } = await supabase
    .from('matches')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single();
  assertNoError(error);
  return data;
}

export async function listMatchesForUser(userId) {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .eq('status', 'activo')
    .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`)
    .order('created_at', { ascending: false });
  assertNoError(error);
  return data ?? [];
}

export async function getMatch(id) {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  assertNoError(error);
  return data;
}

export async function createSession(row) {
  const { data, error } = await supabase
    .from('study_sessions')
    .insert(row)
    .select('*')
    .single();
  assertNoError(error);
  return data;
}

export async function updateSession(id, updates) {
  const { data, error } = await supabase
    .from('study_sessions')
    .update(updates)
    .eq('id', id)
    .select('*')
    .maybeSingle();
  assertNoError(error);
  return data;
}

export async function listSessionsForUser(userId) {
  const { data: matches, error: matchesError } = await supabase
    .from('matches')
    .select('id')
    .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`);
  assertNoError(matchesError);

  const matchIds = (matches ?? []).map((match) => match.id);
  if (!matchIds.length) return [];

  const { data, error } = await supabase
    .from('study_sessions')
    .select('*')
    .in('match_id', matchIds)
    .order('scheduled_at', { ascending: true });
  assertNoError(error);
  return data ?? [];
}

export function httpError(res, error) {
  return res.status(error.status ?? 500).json({
    error: error.message || 'Error interno del servidor',
  });
}
