import Router from '@koa/router';
import * as healthService from '../service/health';
import type { Context } from 'koa';

const ping = async (ctx: Context) => {
  ctx.status = 200;
  ctx.body = healthService.ping();
};

const getDetails = async (ctx: Context) => {
  ctx.status = 200;
  ctx.body = healthService.getDetails();
};

export default (parent: Router) => {
  const router = new Router({ prefix: '/health' });

  router.get('/ping', ping);
  router.get('/details', getDetails);

  parent.use(router.routes()).use(router.allowedMethods());
};
