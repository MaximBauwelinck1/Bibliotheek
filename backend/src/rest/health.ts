import Router from '@koa/router';
import * as healthService from '../service/health';
import type { BibliotheekAppContext, BibliotheekAppState, KoaRouter } from '../types/koa';
import validate from '../core/validation';
import type { KoaContext } from '../types/koa';
import type { Pong,Details } from '../types/health';

const ping = async (ctx: KoaContext<Pong>) => {
  ctx.status = 200;
  ctx.body = healthService.ping();
};
ping.validationScheme = null;

const getDetails = async (ctx: KoaContext<Details>) => {
  ctx.status = 200;
  ctx.body = healthService.getDetails();
};
getDetails.validationScheme = null;
export default (parent: KoaRouter) => {
  const router = new Router<BibliotheekAppState, BibliotheekAppContext>({ prefix: '/health' });

  router.get('/ping',validate(ping.validationScheme), ping);
  router.get('/details',validate(getDetails.validationScheme), getDetails);

  parent.use(router.routes()).use(router.allowedMethods());
};
