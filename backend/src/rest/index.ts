import type Application from 'koa';

import Router from '@koa/router';
import installGebruikerRouter from './gebruiker';

export default (app: Application) => {
  const router = new Router({
    prefix: '/api',
  });

  installGebruikerRouter(router);

  app.use(router.routes()).use(router.allowedMethods());
};
