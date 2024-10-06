// index.ts
import Koa from 'koa';
import { getLogger } from './logging';

const app = new Koa();

app.use(async (ctx) => {
  ctx.body = 'Yarne '; // 👈 2
});

app.listen(9000, () => {
    getLogger().info('🚀 Server listening on http://127.0.0.1:9000');
  });