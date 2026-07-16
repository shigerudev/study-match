import 'dotenv/config';
import app from './app.js';

const port = Number(process.env.PORT) || 3001;

// Solo para desarrollo local; en Vercel se exporta la app sin listen.
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`StudyMatch API en http://localhost:${port}`);
  });
}

export default app;
