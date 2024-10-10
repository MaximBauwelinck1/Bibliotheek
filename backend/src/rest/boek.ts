import Router from '@koa/router';
import * as boekenService from '../service/boek';
import type { Context } from 'koa';
import { validate as isUuid } from 'uuid';
import { getLogger } from '../core/logging';

const getAllBoeken = async (ctx: Context) => {
  ctx.body = {
    boeken: await boekenService.getAll(),
  };
  getLogger().info('Alle boeken zijn opgevraagd.');
};

const createBoek = async (ctx: Context) => {
  const nieuwBoek = boekenService.create({
    ...ctx.request.body,
  });
  if(nieuwBoek instanceof Error){
    ctx.status = 400;
    ctx.body ={ 
      status: 'gefaald',
      error: nieuwBoek.message,
    };
    getLogger().error(
      `Gefaald om boek:${JSON.stringify(ctx.request.body)} aan te maken met foutboodschap:${nieuwBoek}.`);
  } else{
    ctx.body = {
      status: 'geslaagd',
      boekId: nieuwBoek};
    getLogger().info(`boek met id:${nieuwBoek} is succesvol aangemaakt.`);
  }
};

const deleteBoekById= async (ctx: Context) => {
  const id = ctx.params.id;
  const opt_res = boekenService.deleteById(id);
  if(opt_res instanceof Error){
    ctx.status = 400;
    ctx.body = {
      status: 'gefaald',
      foutboodschap: opt_res.message};
    getLogger().error(opt_res);
  } else{
    ctx.body = {
      status: 'geslaagd',
      boekId: opt_res};
    getLogger().info(`boek met id:${ctx.params.id} is succesvol verwijderd.`);
  }
};
const getBoekById = async (ctx: Context) => {
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
  const opt_res = boekenService.getById(ctx.params.id);
  if(opt_res instanceof Error){
    ctx.status = 400;
    ctx.body = {
      status: 'gefaald',
      foutboodschap: opt_res.message};
    getLogger().error(opt_res);
  } else{
    ctx.body = {
      status: 'geslaagd',
      boek: opt_res};
    getLogger().info(`boek met id:${ctx.params.id} is geretourneerd.`);
  }

};

export default (parent: Router) => {
  const router = new Router({
    prefix: '/boeken',
  });

  router.get('/', getAllBoeken);
  router.post('/', createBoek);
  router.get('/:id', getBoekById);
  router.delete('/:id', deleteBoekById);

  parent.use(router.routes()).use(router.allowedMethods());
};
