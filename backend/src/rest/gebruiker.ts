import Router from '@koa/router';
import * as gebruikerService from '../service/gebruikers';
import { getLogger } from '../core/logging';
import type { BibliotheekAppContext, BibliotheekAppState, KoaRouter,KoaContext } from '../types/koa';
import type { IdParams } from '../types/common';
import Joi from 'joi';
import type { UUID } from 'crypto';
import validate from '../core/validation';
import roles from '../core/roles';
import { requireAuthentication, makeRequireRole,authDelay } from '../core/auth';
// eslint-disable-next-line @stylistic/max-len
import type { GetAllgebruikersResponse, GetGebruikerByIdResponse, GetGebruikerRequest, LoginResponse, RegisterGebruikerRequest, UpdateGebruikerRequest, UpdateGebruikerResponse } from '../types/gebruiker';
import type { Next } from 'koa';

const checkUserId = (ctx: KoaContext<unknown, GetGebruikerRequest>, next: Next) => {
  const { userId, role } = ctx.state.session;
  const { id } = ctx.params;

  if (id !== 'me' && id !== userId && role != roles.ADMIN) {
    return ctx.throw(
      403,
      'Je mag de informatie van deze gebruiker niet bekijken.',
      { code: 'FORBIDDEN' },
    );
  }
  return next();
};

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
    id: Joi.alternatives().try(
      Joi.string().uuid(),
      Joi.string().valid('me'),
    ),
  },
};
const getGebruikerById = async (ctx: KoaContext<GetGebruikerByIdResponse, IdParams>) => {
  const id : UUID = ctx.params.id;
  const opt_res =await  gebruikerService.getById( ctx.params.id.toString() === 'me' ? ctx.state.session.userId : id);
  ctx.body = opt_res;
  getLogger().info(`gebruiker met id:${ctx.params.id} is geretourneerd.`);
};

getGebruikerById.validationScheme = {
  params: {
    id: Joi.alternatives().try(
      Joi.string().uuid(),
      Joi.string().valid('me'),
    ),
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
    id: Joi.alternatives().try(
      Joi.string().uuid(),
      Joi.string().valid('me'),
    ),
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

  router.post('/',authDelay,validate(registergebruiker.validationScheme), registergebruiker);

  const requireAdmin = makeRequireRole(roles.ADMIN);
  
  router.get('/', requireAuthentication,requireAdmin,validate(getAllGebruikers.validationScheme), getAllGebruikers);
  router.get('/:id', requireAuthentication,checkUserId, validate(getGebruikerById.validationScheme), getGebruikerById);
  router.delete('/:id',requireAuthentication,checkUserId,
    validate(deleteGebruikerById.validationScheme), deleteGebruikerById);

  router.put('/:id',requireAuthentication,checkUserId,
    validate(updateGebruikerById.validationScheme),updateGebruikerById);

  parent.use(router.routes()).use(router.allowedMethods());
};
