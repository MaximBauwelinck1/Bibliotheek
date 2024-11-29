import Router from '@koa/router';
import * as gebruikerService from '../service/gebruikers';
import * as reservatieService from '../service/reservatie';
import { getLogger } from '../core/logging';
import type { BibliotheekAppContext, BibliotheekAppState, KoaRouter,KoaContext } from '../types/koa';
import type { IdParams } from '../types/common';
import Joi from 'joi';
import type { UUID } from 'crypto';
import validate from '../core/validation';
import roles from '../core/roles';
import { requireAuthentication, makeRequireRole,authDelay } from '../core/auth';
// eslint-disable-next-line @stylistic/max-len
import type { GetAllgebruikersResponse, GetGebruikerByIdResponse, GetGebruikerRequest, LoginResponse, RegisterGebruikerRequest, ForgotPasswordRequest, UpdateGebruikerRequest, UpdateGebruikerResponse, ResetPasswordRequest } from '../types/gebruiker';
import type { Next } from 'koa';
import type { GetAllReservatiesResponse } from '../types/reservatie';

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

const getAlleReservatiesVanGebruiker= async (ctx: KoaContext<GetAllReservatiesResponse,IdParams>) => {
  const {id} = ctx.params;
  ctx.body = {
    items: await reservatieService.
      getAllReservatiesFromUser(ctx.params.id.toString() === 'me' ? ctx.state.session.userId : id),
  };
  getLogger().info('Alle gebruikers zijn opgevraagd.');
};
getAlleReservatiesVanGebruiker.validationScheme = {
  params: {
    id: Joi.alternatives().try(
      Joi.string().uuid(),
      Joi.string().valid('me'),
    ),
  },
};
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
    rol: Joi.string().valid(...Object.values(roles)).optional(),   
    password: Joi.string().min(8).max(128),     
  },
};

const deleteGebruikerById= async (ctx: KoaContext<void, IdParams>) => {
  const id : UUID = ctx.params.id;
  await gebruikerService.deleteById(ctx.params.id.toString() === 'me' ? ctx.state.session.userId : id);
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
  const opt_res =await  gebruikerService.
    updateById(ctx.params.id.toString() === 'me' ? ctx.state.session.userId : id, {...ctx.request.body});
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

const ForgotPassword = async (ctx: KoaContext<void,void, ForgotPasswordRequest>) => {
  await gebruikerService.sendPasswordResetEmail(ctx.request.body.email);
  ctx.status = 201;
  getLogger().info(`Er is een reset password email verstuurd naar:${ctx.request.body.email}.`);
};

ForgotPassword.validationScheme = {
  body: {            
    email: Joi.string().email(),       
  },
};

const ResetPassword = async (ctx: KoaContext<void,void, ResetPasswordRequest>) => {
  await gebruikerService.resetPassword({...ctx.request.body});
  ctx.status = 201;
  getLogger().info(`Wachtwoord is succesvol reset met token:${ctx.request.body.token}.`);
};

ResetPassword.validationScheme = {
  body: {            
    password: Joi.string(),
    token: Joi.string(),     
  },
};

export default (parent: KoaRouter) => {
  const router = new Router<BibliotheekAppState, BibliotheekAppContext>({
    prefix: '/gebruikers',
  });

  router.post('/passwordForgot',validate(ForgotPassword.validationScheme),ForgotPassword);
  router.post('/passwordReset',validate(ResetPassword.validationScheme),ResetPassword);
  router.post('/',authDelay,validate(registergebruiker.validationScheme), registergebruiker);
  const requireAdmin = makeRequireRole(roles.ADMIN);
  router.get('/:id/reservaties', requireAuthentication,checkUserId,
    validate(getAlleReservatiesVanGebruiker.validationScheme), getAlleReservatiesVanGebruiker);

  router.get('/', requireAuthentication,requireAdmin,validate(getAllGebruikers.validationScheme), getAllGebruikers);
  router.get('/:id', requireAuthentication,checkUserId, validate(getGebruikerById.validationScheme), getGebruikerById);
  router.delete('/:id',requireAuthentication,checkUserId,
    validate(deleteGebruikerById.validationScheme), deleteGebruikerById);

  router.put('/:id',requireAuthentication,checkUserId,
    validate(updateGebruikerById.validationScheme),updateGebruikerById);

  parent.use(router.routes()).use(router.allowedMethods());
};
