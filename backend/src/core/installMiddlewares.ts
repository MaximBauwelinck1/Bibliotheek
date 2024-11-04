import config from 'config';
import bodyParser from 'koa-bodyparser';
import koaCors from '@koa/cors';
import type { KoaApplication } from '../types/koa';
import { getLogger } from './logging';

const CORS_ORIGINS = config.get<string[]>('cors.origins');
const CORS_MAX_AGE = config.get<number>('cors.maxAge');

export default function installMiddlewares(app: KoaApplication) {
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

  app.use(async (ctx, next) => {
    getLogger().info(`⏩ ${ctx.method} ${ctx.url}`);
  
    const getStatusEmoji = () => {
      if (ctx.status >= 500) return '💀';
      if (ctx.status >= 400) return '❌';
      if (ctx.status >= 300) return '🔀';
      if (ctx.status >= 200) return '✅';
      return '🔄';
    };
  
    await next();
  
    getLogger().info(
      `${getStatusEmoji()} ${ctx.method} ${ctx.status} ${ctx.url}`,
    );
  });
  app.use(bodyParser());
}
