// index.ts
import Koa from 'koa';
import { getLogger } from './core/logging';
import bodyParser from 'koa-bodyparser';
import Router from '@koa/router';
import { validate as isUuid } from 'uuid';
import * as gebruikerService from './service/gebruikers';

const app = new Koa();
app.use(bodyParser()); 
const router = new Router();

router.get('/api/gebruikers', async (ctx) => {
  ctx.body = {
    gebruikers: gebruikerService.getAll(),
  };
});

router.post('/api/gebruikers', async (ctx) => {
  ctx.body = {
    gebruikers: gebruikerService.create({...ctx.request.body}),
  };
});

router.get('/api/gebruikers/:id', async (ctx) => {
  const id = ctx.params.id;

  if (!id) {
    ctx.status = 400;
    ctx.body = { error: 'ID is required' };
    return;
  }
  
  if (!isUuid(id)) {
    ctx.status = 400;
    ctx.body = { error: 'Invalid UUID' };
    return;
  }

  const gebruiker = gebruikerService.getById(id);
  ctx.body = gebruiker;
  
});
  
app
  .use(router.routes())
  .use(router.allowedMethods()); 

app.listen(9000, () => {
  getLogger().info('🚀 Server listening on http://127.0.0.1:9000');
});