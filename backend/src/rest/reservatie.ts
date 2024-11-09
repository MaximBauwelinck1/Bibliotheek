import Router from '@koa/router';
import * as reservatieService from '../service/reservatie';
import { getLogger } from '../core/logging';
import type { UUID } from 'crypto';
import type { BibliotheekAppContext, BibliotheekAppState, KoaContext, KoaRouter } from '../types/koa';
import type { IdParams } from '../types/common';
import Joi from 'joi';
import validate from '../core/validation';
// eslint-disable-next-line @stylistic/max-len
import type { CreateReservatieRequest, CreateReservatieResponse, GetAllReservatiesResponse, GetReservatieByIdResponse, UpdateReservatieRequest, UpdateReservatieResponse } from '../types/reservatie';

const getAllReservaties = async (ctx: KoaContext<GetAllReservatiesResponse>) => {
  ctx.body = {
    items: await reservatieService.getAll(),
  };
  getLogger().info('Alle reservaties zijn opgevraagd.');
};
getAllReservaties.validationScheme = null;

const createReservatie = async (ctx: KoaContext<CreateReservatieResponse, void, CreateReservatieRequest>) => {
  const nieuweReservatie = await reservatieService.create({
    ...ctx.request.body,
  });
  ctx.body = nieuweReservatie;
  ctx.status = 201;
  getLogger().info(`reservatie met id:${nieuweReservatie} is succesvol aangemaakt.`);
};

createReservatie.validationScheme = {
  body: {           
    boek_kopie_id: Joi.string().uuid(),          
    gebruiker_id: Joi.string().uuid(),    
    einddatum: Joi.date().greater('now'),   
    status: Joi.string().valid('actief','niet-actief'),     
  },
};

const deleteReservatieById= async (ctx: KoaContext<void, IdParams>) => {
  const id : UUID = ctx.params.id;
  await reservatieService.deleteById(id);
  ctx.status = 204;
  getLogger().info(`reservatie met id:${ctx.params.id} is succesvol verwijderd.`);
};
deleteReservatieById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};
const getReservatieById = async (ctx: KoaContext<GetReservatieByIdResponse, IdParams>) => {
  const id : UUID = ctx.params.id;
  const opt_res =await  reservatieService.getById(id);
  ctx.body = opt_res;
  getLogger().info(`reservatie met id:${ctx.params.id} is geretourneerd.`);
};

getReservatieById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};
const updateBoekById = async( ctx: KoaContext<UpdateReservatieResponse, IdParams, UpdateReservatieRequest>) => {
  const id : UUID = ctx.params.id;
  const opt_res =await  reservatieService.updateById(id, {...ctx.request.body});
  ctx.body = opt_res;
  getLogger().info(`reservatie met id:${ctx.params.id} is succesvol geupdate.`);
};

updateBoekById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
  body: {   
    einddatum: Joi.date().greater('now').optional(),   
    status: Joi.string().valid('actief','niet-actief'),  
  },
};

export default (parent: KoaRouter) => {
  const router = new Router<BibliotheekAppState, BibliotheekAppContext>({
    prefix: '/reservaties',
  });

  router.get('/',validate(getAllReservaties.validationScheme), getAllReservaties);
  router.post('/',validate(createReservatie.validationScheme), createReservatie);
  router.get('/:id',  validate(getReservatieById.validationScheme), getReservatieById);
  router.delete('/:id',validate(deleteReservatieById.validationScheme), deleteReservatieById);
  router.put('/:id',validate(updateBoekById.validationScheme),updateBoekById);

  parent.use(router.routes()).use(router.allowedMethods());
};
