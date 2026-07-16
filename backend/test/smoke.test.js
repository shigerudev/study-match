import assert from 'node:assert/strict';
import test from 'node:test';

const hasSupabase =
  Boolean(process.env.SUPABASE_URL) &&
  Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY) &&
  !String(process.env.SUPABASE_URL).includes('TU_PROYECTO');

const sofiaId = '00000000-0000-4000-8000-000000000001';
const baseUrl = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:3001';

test(
  'smoke: health responde ok',
  { skip: !hasSupabase || !process.env.SMOKE_BASE_URL },
  async () => {
    const response = await fetch(`${baseUrl}/api/health`);
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.ok, true);
    assert.equal(body.storage, 'supabase');
  },
);

test(
  'smoke: feed y perfil de Sofía',
  { skip: !hasSupabase || !process.env.SMOKE_BASE_URL },
  async () => {
    const [feed, profile, saved] = await Promise.all([
      fetch(`${baseUrl}/api/posts?subject=Cálculo`),
      fetch(`${baseUrl}/api/users/${sofiaId}`),
      fetch(`${baseUrl}/api/saved-posts?userId=${sofiaId}`),
    ]);

    assert.equal(feed.status, 200);
    assert.equal(profile.status, 200);
    assert.equal(saved.status, 200);

    const feedBody = await feed.json();
    const profileBody = await profile.json();
    const savedBody = await saved.json();

    assert.ok(Array.isArray(feedBody.posts));
    assert.equal(profileBody.user.id, sofiaId);
    assert.ok(Array.isArray(savedBody.posts));
  },
);
