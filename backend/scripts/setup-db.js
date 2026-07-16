import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.join(__dirname, '..', '..');

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('Falta DATABASE_URL en .env (Supabase → Settings → Database → URI)');
  process.exit(1);
}

const client = new pg.Client({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
});

async function runFile(relativePath) {
  const fullPath = path.join(repositoryRoot, relativePath);
  const sql = fs.readFileSync(fullPath, 'utf8');
  console.log(`Ejecutando ${relativePath}...`);
  await client.query(sql);
  console.log(`OK ${relativePath}`);
}

async function schemaExists() {
  const { rows } = await client.query(`
    select exists (
      select 1
      from information_schema.tables
      where table_schema = 'public' and table_name = 'profiles'
    ) as ready
  `);
  return Boolean(rows[0]?.ready);
}

async function main() {
  await client.connect();

  const alreadyMigrated = await schemaExists();
  if (alreadyMigrated) {
    console.log('Esquema detectado: se omite la migración y solo se aplica el seed.');
  } else {
    await runFile('supabase/migrations/202607160001_initial_schema.sql');
  }

  await runFile('supabase/seed.sql');
  console.log('Base de datos lista.');
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await client.end().catch(() => {});
  });
