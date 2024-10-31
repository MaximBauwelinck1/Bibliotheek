// index.ts
import Koa from 'koa';
import { getLogger } from './core/logging';
import bodyParser from 'koa-bodyparser';
import installRest from './rest';
import { initializeData } from './data';
import type { BibliotheekAppContext, BibliotheekAppState } from './types/koa';
import config from 'config';
import koaCors from '@koa/cors';
  
async function main(): Promise<void> {
  const app = new Koa<BibliotheekAppState, BibliotheekAppContext>();
  const CORS_ORIGINS = config.get<string[]>('cors.origins'); // 👈 2
  const CORS_MAX_AGE = config.get<number>('cors.maxAge');
  app.use(
    koaCors({
      origin: (ctx) => {
        if (CORS_ORIGINS.indexOf(ctx.request.header.origin!) !== -1) {
          return ctx.request.header.origin!;
        }
        return CORS_ORIGINS[0] || '';
      },
      allowHeaders: ['Accept', 'Content-Type', 'Authorization'],
      maxAge: CORS_MAX_AGE,
    }),
  );
  app.use(bodyParser()); 
  installRest(app);
  await initializeData(); 
  app.listen(9000, () => {
    getLogger().info('🚀 Server listening on http://127.0.0.1:9000');
  });
}
main();

