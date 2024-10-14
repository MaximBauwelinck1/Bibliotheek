import Router from '@koa/router';
import installGebruikerRouter from './gebruiker';
import installHealthRouter from './health';
import installBoekenRouter from './boek';
import type { BibliotheekAppContext, BibliotheekAppState, KoaApplication } from '../types/koa';

export default (app: KoaApplication) => {
  const router = new Router<BibliotheekAppState, BibliotheekAppContext>({
    prefix: '/api',
  });

  installGebruikerRouter(router);
  installHealthRouter(router);
  installBoekenRouter(router);

  app.use(router.routes()).use(router.allowedMethods());
};
