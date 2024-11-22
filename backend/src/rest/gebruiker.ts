import Router from '@koa/router';
import * as gebruikerService from '../service/gebruikers';
import { getLogger } from '../core/logging';
import type { BibliotheekAppContext, BibliotheekAppState, KoaRouter,KoaContext } from '../types/koa';
import type { IdParams } from '../types/common';
import Joi from 'joi';
import type { UUID } from 'crypto';
import validate from '../core/validation';
import roles from '../core/roles';
// eslint-disable-next-line @stylistic/max-len
import type { GetAllgebruikersResponse, GetGebruikerByIdResponse, LoginResponse, RegisterGebruikerRequest, UpdateGebruikerRequest, UpdateGebruikerResponse } from '../types/gebruiker';

const getAllGebruikers = async (ctx: KoaContext<GetAllgebruikersResponse>) => {
  ctx.body = {
    items: await gebruikerService.getAll(),
  };
  getLogger().info('Alle gebruikers zijn opgevraagd.');
};
getAllGebruikers.validationScheme = null;

const registergebruiker = async (ctx: KoaContext<LoginResponse, void, RegisterGebruikerRequest>) => {
  const token = await gebruikerService.register({
    ...ctx.request.body,
  });
  ctx.body = {token};
  ctx.status = 201;
  getLogger().info(`gebruiker met token:${token} is succesvol aangemaakt.`);
};

registergebruiker.validationScheme = {
  body: {            
    voornaam: Joi.string(),            
    achternaam: Joi.string(),                
    geboortedatum: Joi.date().max('now'),          
    email: Joi.string().email(),    
    rol: Joi.string().valid(...Object.values(roles)),   
    password: Joi.string().min(8).max(128),     
  },
};

const deleteGebruikerById= async (ctx: KoaContext<void, IdParams>) => {
  const id : UUID = ctx.params.id;
  await gebruikerService.deleteById(id);
  ctx.status = 204;
  getLogger().info(`gebruiker met id:${ctx.params.id} is succesvol verwijderd.`);
};
deleteGebruikerById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};
const getGebruikerById = async (ctx: KoaContext<GetGebruikerByIdResponse, IdParams>) => {
  const id : UUID = ctx.params.id;
  const opt_res =await  gebruikerService.getById(id);
  ctx.body = opt_res;
  getLogger().info(`gebruiker met id:${ctx.params.id} is geretourneerd.`);
};

getGebruikerById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};
const updateGebruikerById = async( ctx: KoaContext<UpdateGebruikerResponse, IdParams, UpdateGebruikerRequest>) => {
  const id : UUID = ctx.params.id;
  const opt_res =await  gebruikerService.updateById(id, {...ctx.request.body});
  ctx.body = opt_res;
  getLogger().info(`gebruiker met id:${ctx.params.id} is succesvol geupdate.`);
};

updateGebruikerById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
  body: {            
    voornaam: Joi.string().optional(),            
    achternaam: Joi.string().optional(),                
    geboortedatum: Joi.date().max('now').optional(),          
    email: Joi.string().email().optional(),    
    rol: Joi.string().valid(...Object.values(roles)).optional(),   
    password: Joi.string().min(8).max(128).optional(),     
  },
};

export default (parent: KoaRouter) => {
  const router = new Router<BibliotheekAppState, BibliotheekAppContext>({
    prefix: '/gebruikers',
  });

  router.get('/',validate(getAllGebruikers.validationScheme), getAllGebruikers);
  router.post('/',validate(registergebruiker.validationScheme), registergebruiker);
  router.get('/:id',  validate(getGebruikerById.validationScheme), getGebruikerById);
  router.delete('/:id',validate(deleteGebruikerById.validationScheme), deleteGebruikerById);
  router.put('/:id',validate(updateGebruikerById.validationScheme),updateGebruikerById);

  parent.use(router.routes()).use(router.allowedMethods());
};
