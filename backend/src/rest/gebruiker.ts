import Router from '@koa/router';
import * as gebruikerService from '../service/gebruikers';
import type { Context } from 'koa';
import { validate as isUuid } from 'uuid';

const getAllGebruikers = async (ctx: Context) => {
  ctx.body = {
    gebruikers: gebruikerService.getAll(),
  };
};

const createGebruiker = async (ctx: Context) => {
  const nieweGebruiker = gebruikerService.create({
    ...ctx.request.body,
  });
  ctx.body = nieweGebruiker;
};

const getGebruikerById = async (ctx: Context) => {
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
  ctx.body = gebruikerService.getById(ctx.params.id);
};

export default (parent: Router) => {
  const router = new Router({
    prefix: '/gebruikers',
  });

  router.get('/', getAllGebruikers);
  router.post('/', createGebruiker);
  router.get('/:id', getGebruikerById);

  parent.use(router.routes()).use(router.allowedMethods());
};
