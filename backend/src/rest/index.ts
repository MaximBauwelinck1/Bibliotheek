import type Application from 'koa';

import Router from '@koa/router';
import installGebruikerRouter from './gebruiker';
import installHealthRouter from './health';

export default (app: Application) => {
  const router = new Router({
    prefix: '/api',
  });

  installGebruikerRouter(router);
  installHealthRouter(router);

  app.use(router.routes()).use(router.allowedMethods());
};
