import Router from '@koa/router';
import * as gebruikerService from '../service/gebruikers';
import type { Context } from 'koa';
import { validate as isUuid } from 'uuid';
import { getLogger } from '../core/logging';

const getAllGebruikers = async (ctx: Context) => {
  ctx.body = {
    gebruikers: gebruikerService.getAll(),
  };
  getLogger().info('Alle gebruikers zijn opgevraagd.');
};

const createGebruiker = async (ctx: Context) => {
  const nieweGebruiker = gebruikerService.create({
    ...ctx.request.body,
  });
  if(nieweGebruiker instanceof Error){
    ctx.status = 400;
    ctx.body ={ 
      status: 'gefaald',
      error: nieweGebruiker.message,
    };
    getLogger().error(
      `Gefaald om gebruiker:${JSON.stringify(ctx.request.body)} aan te maken met foutboodschap:${nieweGebruiker}.`);
  } else{
    ctx.body = {
      status: 'geslaagd',
      gebruikerId: nieweGebruiker};
    getLogger().info(`Gebruiker met id:${nieweGebruiker} is succesvol aangemaakt.`);
  }
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
  const opt_res = gebruikerService.getById(ctx.params.id);
  if(opt_res instanceof Error){
    ctx.status = 400;
    ctx.body = {
      status: 'gefaald',
      foutboodschap: opt_res.message};
    getLogger().info(opt_res);
  } else{
    ctx.body = {
      status: 'geslaagd',
      gebruiker: opt_res};
    getLogger().info(`Gebruiker met id:${ctx.params.id} is geretourneerd.`);
  }

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
