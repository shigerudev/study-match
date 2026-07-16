import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

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
  const fullPath = path.join(root, relativePath);
  const sql = fs.readFileSync(fullPath, 'utf8');
  console.log(`Ejecutando ${relativePath}...`);
  await client.query(sql);
  console.log(`OK ${relativePath}`);
}

async function main() {
  await client.connect();
  await runFile('sql/schema.sql');
  await runFile('sql/seed.sql');
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
