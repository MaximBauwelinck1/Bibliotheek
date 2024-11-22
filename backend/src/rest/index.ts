import Router from '@koa/router';
import installGebruikerRouter from './gebruiker';
import installHealthRouter from './health';
import installBoekenRouter from './boek';
import installReservatiesRouter from './reservatie';
import installKopieRouter from './kopie';
import installSessionRouter from './session';
import type { BibliotheekAppContext, BibliotheekAppState, KoaApplication } from '../types/koa';

export default (app: KoaApplication) => {
  const router = new Router<BibliotheekAppState, BibliotheekAppContext>({
    prefix: '/api',
  });

  installGebruikerRouter(router);
  installHealthRouter(router);
  installBoekenRouter(router);
  installReservatiesRouter(router);
  installKopieRouter(router);
  installSessionRouter(router);
  app.use(router.routes()).use(router.allowedMethods());
};
