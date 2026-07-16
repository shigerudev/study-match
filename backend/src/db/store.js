import { memory, supabase, usingMemory } from './supabase.js';

function notFound(entity) {
  const err = new Error(`${entity} no encontrado`);
  err.status = 404;
  throw err;
}

export async function listSubjects() {
  if (usingMemory) {
    return [...memory.subjects].sort((a, b) => a.name.localeCompare(b.name));
  }
  const { data, error } = await supabase.from('subjects').select('*').order('name');
  if (error) throw Object.assign(new Error(error.message), { status: 500 });
  return data;
}

export async function getUser(id) {
  if (usingMemory) {
    return memory.users.find((u) => u.id === id) ?? null;
  }
  const { data, error } = await supabase.from('users').select('*').eq('id', id).maybeSingle();
  if (error) throw Object.assign(new Error(error.message), { status: 500 });
  return data;
}

export async function updateUser(id, updates) {
  if (usingMemory) {
    const idx = memory.users.findIndex((u) => u.id === id);
    if (idx < 0) return null;
    memory.users[idx] = { ...memory.users[idx], ...updates };
    return memory.users[idx];
  }
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select('*')
    .maybeSingle();
  if (error) throw Object.assign(new Error(error.message), { status: 500 });
  return data;
}

export async function listPosts({ subject, q } = {}) {
  if (usingMemory) {
    let posts = memory.posts
      .filter((p) => p.status === 'publicada')
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .map((p) => ({
        ...p,
        author: memory.users.find((u) => u.id === p.author_id),
        subject: memory.subjects.find((s) => s.id === p.subject_id),
      }));

    if (subject && subject !== 'Todo') {
      posts = posts.filter((p) => p.subject?.name?.toLowerCase() === String(subject).toLowerCase());
    }
    if (q && String(q).trim()) {
      const term = String(q).trim().toLowerCase();
      posts = posts.filter((post) => {
        const haystack = [
          post.title,
          post.description,
          ...(post.tags ?? []),
          post.subject?.name,
          post.author?.name,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return haystack.includes(term);
      });
    }
    return posts;
  }

  let query = supabase
    .from('posts')
    .select('*, author:users!author_id(*), subject:subjects!subject_id(*)')
    .eq('status', 'publicada')
    .order('created_at', { ascending: false });

  if (subject && subject !== 'Todo') {
    const { data: subjects, error: subjectError } = await supabase
      .from('subjects')
      .select('id, name')
      .ilike('name', subject);
    if (subjectError) throw Object.assign(new Error(subjectError.message), { status: 500 });
    const ids = (subjects ?? []).map((s) => s.id);
    if (!ids.length) return [];
    query = query.in('subject_id', ids);
  }

  const { data, error } = await query;
  if (error) throw Object.assign(new Error(error.message), { status: 500 });

  let posts = data ?? [];
  if (q && String(q).trim()) {
    const term = String(q).trim().toLowerCase();
    posts = posts.filter((post) => {
      const haystack = [
        post.title,
        post.description,
        ...(post.tags ?? []),
        post.subject?.name,
        post.author?.name,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(term);
    });
  }
  return posts;
}

export async function createPost(row) {
  if (usingMemory) {
    const post = { ...row, status: 'publicada', created_at: new Date().toISOString() };
    memory.posts.unshift(post);
    return {
      ...post,
      author: memory.users.find((u) => u.id === post.author_id),
      subject: memory.subjects.find((s) => s.id === post.subject_id),
    };
  }
  const { data, error } = await supabase
    .from('posts')
    .insert(row)
    .select('*, author:users!author_id(*), subject:subjects!subject_id(*)')
    .single();
  if (error) throw Object.assign(new Error(error.message), { status: 500 });
  return data;
}

export async function listUsers() {
  if (usingMemory) return [...memory.users];
  const { data, error } = await supabase.from('users').select('*').order('name');
  if (error) throw Object.assign(new Error(error.message), { status: 500 });
  return data ?? [];
}

export async function listSwipesByActor(actorId) {
  if (usingMemory) return memory.swipes.filter((s) => s.actor_id === actorId);
  const { data, error } = await supabase.from('swipes').select('*').eq('actor_id', actorId);
  if (error) throw Object.assign(new Error(error.message), { status: 500 });
  return data ?? [];
}

export async function findSwipe(actorId, targetId) {
  if (usingMemory) {
    return memory.swipes.find((s) => s.actor_id === actorId && s.target_id === targetId) ?? null;
  }
  const { data, error } = await supabase
    .from('swipes')
    .select('*')
    .eq('actor_id', actorId)
    .eq('target_id', targetId)
    .maybeSingle();
  if (error) throw Object.assign(new Error(error.message), { status: 500 });
  return data;
}

export async function createSwipe(row) {
  if (usingMemory) {
    const swipe = { ...row, created_at: new Date().toISOString() };
    memory.swipes.push(swipe);
    return swipe;
  }
  const { data, error } = await supabase.from('swipes').insert(row).select('*').single();
  if (error) throw Object.assign(new Error(error.message), { status: 500 });
  return data;
}

export async function findMatchPair(userAId, userBId) {
  if (usingMemory) {
    return (
      memory.matches.find((m) => m.user_a_id === userAId && m.user_b_id === userBId) ?? null
    );
  }
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .eq('user_a_id', userAId)
    .eq('user_b_id', userBId)
    .maybeSingle();
  if (error) throw Object.assign(new Error(error.message), { status: 500 });
  return data;
}

export async function createMatch(row) {
  if (usingMemory) {
    const match = { ...row, created_at: new Date().toISOString() };
    memory.matches.push(match);
    return match;
  }
  const { data, error } = await supabase.from('matches').insert(row).select('*').single();
  if (error) throw Object.assign(new Error(error.message), { status: 500 });
  return data;
}

export async function listMatchesForUser(userId) {
  if (usingMemory) {
    return memory.matches
      .filter((m) => m.status === 'activo' && (m.user_a_id === userId || m.user_b_id === userId))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .eq('status', 'activo')
    .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`)
    .order('created_at', { ascending: false });
  if (error) throw Object.assign(new Error(error.message), { status: 500 });
  return data ?? [];
}

export async function getMatch(id) {
  if (usingMemory) return memory.matches.find((m) => m.id === id) ?? null;
  const { data, error } = await supabase.from('matches').select('*').eq('id', id).maybeSingle();
  if (error) throw Object.assign(new Error(error.message), { status: 500 });
  return data;
}

export async function createSession(row) {
  if (usingMemory) {
    const session = { ...row, created_at: new Date().toISOString() };
    memory.sessions.push(session);
    return session;
  }
  const { data, error } = await supabase.from('sessions').insert(row).select('*').single();
  if (error) throw Object.assign(new Error(error.message), { status: 500 });
  return data;
}

export async function updateSession(id, updates) {
  if (usingMemory) {
    const idx = memory.sessions.findIndex((s) => s.id === id);
    if (idx < 0) return null;
    memory.sessions[idx] = { ...memory.sessions[idx], ...updates };
    return memory.sessions[idx];
  }
  const { data, error } = await supabase
    .from('sessions')
    .update(updates)
    .eq('id', id)
    .select('*')
    .maybeSingle();
  if (error) throw Object.assign(new Error(error.message), { status: 500 });
  return data;
}

export async function listSessionsForUser(userId) {
  if (usingMemory) {
    const matchIds = new Set(
      memory.matches
        .filter((m) => m.user_a_id === userId || m.user_b_id === userId)
        .map((m) => m.id),
    );
    return memory.sessions
      .filter((s) => matchIds.has(s.match_id))
      .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at));
  }

  const { data: matches, error: matchesError } = await supabase
    .from('matches')
    .select('id')
    .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`);
  if (matchesError) throw Object.assign(new Error(matchesError.message), { status: 500 });
  const matchIds = (matches ?? []).map((m) => m.id);
  if (!matchIds.length) return [];

  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .in('match_id', matchIds)
    .order('scheduled_at', { ascending: true });
  if (error) throw Object.assign(new Error(error.message), { status: 500 });
  return data ?? [];
}

export function httpError(res, err) {
  const status = err.status || 500;
  return res.status(status).json({ error: err.message || 'Error interno' });
}

export { notFound };
