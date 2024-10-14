import Router from '@koa/router';
import * as boekenService from '../service/boek';
import type { Context } from 'koa';
import { validate as isUuid } from 'uuid';
import { getLogger } from '../core/logging';
import type { UUID } from 'crypto';
import type { BibliotheekAppContext, BibliotheekAppState, KoaContext, KoaRouter } from '../types/koa';
import type { CreateBoekRequest, CreateBoekResponse, GetAllBoekenResponse, GetBoekByIdResponse, UpdateBoekRequest, UpdateBoekResponse } from '../types/boek';
import type { IdParams } from '../types/common';

const getAllBoeken = async (ctx: KoaContext<GetAllBoekenResponse>) => {
  ctx.body = {
    items: await boekenService.getAll(),
  };
  getLogger().info('Alle boeken zijn opgevraagd.');
};

const createBoek = async (ctx: KoaContext<CreateBoekResponse, void, CreateBoekRequest>) => {
  const nieuwBoek = await boekenService.create({
    ...ctx.request.body,
  });
  /*
  if (nieuwBoek instanceof Error){
    ctx.status = 400;
    ctx.body = nieuwBoek.message;
    getLogger().error(
      `Gefaald om boek:${JSON.stringify(ctx.request.body)} aan te maken met foutboodschap:${nieuwBoek}.`);
  } else{*/
  ctx.body = nieuwBoek;
  getLogger().info(`boek met id:${nieuwBoek} is succesvol aangemaakt.`);
  // }
};

const deleteBoekById= async (ctx: KoaContext<void, IdParams>) => {
  const id : UUID = ctx.params.id;
  const opt_res = await boekenService.deleteById(id);
  /*if(opt_res instanceof Error){
    ctx.status = 400;
    ctx.body = {
      status: 'gefaald',
      foutboodschap: opt_res.message};
    getLogger().error(opt_res);
  } else{*/
  ctx.status = 204;
  getLogger().info(`boek met id:${ctx.params.id} is succesvol verwijderd.`);
  // }
};
const getBoekById = async (ctx: KoaContext<GetBoekByIdResponse, IdParams>) => {
  const id : UUID = ctx.params.id;
  const opt_res =await  boekenService.getById(id);
  /*
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
  const opt_res =await  boekenService.getById(ctx.params.id);
  if(opt_res instanceof Error){
    ctx.status = 400;
    ctx.body = {
      status: 'gefaald',
      foutboodschap: opt_res.message};
    getLogger().error(opt_res);
  } else{*/
  ctx.body = opt_res;
  getLogger().info(`boek met id:${ctx.params.id} is geretourneerd.`);
  //}

};
const updateBoekById = async( ctx: KoaContext<UpdateBoekResponse, IdParams, UpdateBoekRequest>) => {
  const id : UUID = ctx.params.id;

  const opt_res =await  boekenService.updateById(id, {...ctx.request.body});
  /*
  if(opt_res instanceof Error){
    ctx.status = 400;
    ctx.body = {
      status: 'gefaald',
      foutboodschap: opt_res.message};
    getLogger().error(opt_res);
  } else{*/
  ctx.body = opt_res;
  getLogger().info(`boek met id:${ctx.params.id} is succesvol geupdate.`);
  //}
};

export default (parent: KoaRouter) => {
  const router = new Router<BibliotheekAppState, BibliotheekAppContext>({
    prefix: '/boeken',
  });

  router.get('/', getAllBoeken);
  router.post('/', createBoek);
  router.get('/:id', getBoekById);
  router.delete('/:id', deleteBoekById);
  router.put('/:id',updateBoekById);

  parent.use(router.routes()).use(router.allowedMethods());
};
