import Router from '@koa/router';
import * as kopieService from '../service/kopie';
import { getLogger } from '../core/logging';
import type { BibliotheekAppContext, BibliotheekAppState, KoaRouter,KoaContext } from '../types/koa';
import type { IdParams } from '../types/common';
import Joi from 'joi';
import type { UUID } from 'crypto';
import validate from '../core/validation';
// eslint-disable-next-line @stylistic/max-len
import type { CreateBoekKopieRequest, CreateBoekKopieResponse, GetAllBoekkopieennResponse, GetBoekkopieByIdResponse, UpdateBoekKopieRequest, UpdateBoekKopieResponse } from '../types/boek_kopie';

const getAllKopieen = async (ctx: KoaContext<GetAllBoekkopieennResponse>) => {
  ctx.body = {
    items: await kopieService.getAll(),
  };
  getLogger().info('Alle Kopieën zijn opgevraagd.');
};
getAllKopieen.validationScheme = null;

const createKopie = async (ctx: KoaContext<CreateBoekKopieResponse, void, CreateBoekKopieRequest>) => {
  const nieuwKopie = await kopieService.create({
    ...ctx.request.body,
  });
  ctx.body = nieuwKopie;
  ctx.status = 201;
  getLogger().info(`Kopie met id:${nieuwKopie.id} is succesvol aangemaakt.`);
};

createKopie.validationScheme = {
  body: {            
    boek_id: Joi.string().uuid(),            
    status: Joi.string().valid('beschikbaar','gereserveerd'),                
    extra_informatie: Joi.string(),          
  },
};

const deleteKopieById= async (ctx: KoaContext<void, IdParams>) => {
  const id : UUID = ctx.params.id;
  await kopieService.deleteById(id);
  ctx.status = 204;
  getLogger().info(`Kopie met id:${ctx.params.id} is succesvol verwijderd.`);
};
deleteKopieById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};
const getKopieById = async (ctx: KoaContext<GetBoekkopieByIdResponse, IdParams>) => {
  const id : UUID = ctx.params.id;
  const opt_res =await  kopieService.getById(id);
  ctx.body = opt_res;
  getLogger().info(`Kopie met id:${ctx.params.id} is geretourneerd.`);
};

getKopieById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};
const updateKopieById = async( ctx: KoaContext<UpdateBoekKopieResponse, IdParams, UpdateBoekKopieRequest>) => {
  const id : UUID = ctx.params.id;
  const opt_res =await  kopieService.updateById(id, {...ctx.request.body});
  ctx.body = opt_res;
  getLogger().info(`Kopie met id:${ctx.params.id} is succesvol geupdate.`);
};

updateKopieById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
  body: {                    
    status: Joi.string().valid('beschikbaar','gereserveerd').optional(),                
    extra_informatie: Joi.string().optional(),      
  },
};

export default (parent: KoaRouter) => {
  const router = new Router<BibliotheekAppState, BibliotheekAppContext>({
    prefix: '/kopieen',
  });

  router.get('/',validate(getAllKopieen.validationScheme), getAllKopieen);
  router.post('/',validate(createKopie.validationScheme), createKopie);
  router.get('/:id',  validate(getKopieById.validationScheme), getKopieById);
  router.delete('/:id',validate(deleteKopieById.validationScheme), deleteKopieById);
  router.put('/:id',validate(updateKopieById.validationScheme),updateKopieById);

  parent.use(router.routes()).use(router.allowedMethods());
};
