import Router from '@koa/router';
import * as boekenService from '../service/boek';
import { getLogger } from '../core/logging';
import type { UUID } from 'crypto';
import type { BibliotheekAppContext, BibliotheekAppState, KoaContext, KoaRouter } from '../types/koa';
// eslint-disable-next-line @stylistic/max-len
import type { CreateBoekRequest, CreateBoekResponse, GetAllBoekenResponse, GetBoekByIdResponse, UpdateBoekRequest, UpdateBoekResponse } from '../types/boek';
import type { IdParams } from '../types/common';
import Joi from 'joi';
import validate from '../core/validation';

const getAllBoeken = async (ctx: KoaContext<GetAllBoekenResponse>) => {
  const  genre = ctx.query.genre;
  ctx.body = {
    items: await boekenService.getAll(genre),
  };
  getLogger().info('Alle boeken zijn opgevraagd.');
};
getAllBoeken.validationScheme = {
  query:{
    genre: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())).optional(),
  },
};

const createBoek = async (ctx: KoaContext<CreateBoekResponse, void, CreateBoekRequest>) => {
  const nieuwBoek = await boekenService.create({
    ...ctx.request.body,
  });
  ctx.body = nieuwBoek;
  getLogger().info(`boek met id:${nieuwBoek} is succesvol aangemaakt.`);
};

createBoek.validationScheme = {
  body: {
    ISBN: Joi.string()
      .custom((value) => {
         
        const isValidISBN = (isbn: string): boolean => {
          // boek kan nog isbn 13 of 10 gebruiken
          const isbn13Regex = /^(978|979)\d{10}$/; 
          const isbn10Regex = /^(?:\d{9}[\dX])$/; 
         
          if (isbn13Regex.test(isbn)) {
            // indien isbn 13
            const checkDigit = Array.from(isbn)
              .slice(0, 12)
              .reduce((sum, num, index) => sum + (index % 2 === 0 ? Number(num) : Number(num) * 3), 0) % 10;
            const calculatedCheckDigit = checkDigit === 0 ? 0 : 10 - checkDigit;
            return calculatedCheckDigit === Number(isbn[12]);
          } else if (isbn10Regex.test(isbn)) {
            const checkDigit = Array.from(isbn)
              .slice(0, 9)
              .reduce((sum, num, index) => sum + (Number(num) * (10 - index)), 0) % 11;
            const calculatedCheckDigit = checkDigit === 10 ? 'X' : checkDigit;
              
            return calculatedCheckDigit.toString() === (isbn[9] as string).toUpperCase();
             
          }
          throw new Error('Het ISBN formaat is ongeldig'); // geen geldig isbn formaat
          
        };

        if (!isValidISBN(value)) {
          return false;
        }
        return value; 
      }).message('Het ISBN formaat is ongeldig'),
    titel: Joi.string(),            
    genre: Joi.string()
      .valid(
        'Fictie', 'non fictie', 'Mysterie', 'Fantasie', 
        'Science fiction', 'Biografie', 'Romantiek', 
        'Geschiedenis', 'Dystopisch', 'Souterh- gothic', 
        'post-apocaliptisch', 'anti-war', 'tragedie', 
        'avontuur','Memoir','Thriller',
      ),            
    publicatie_datum: Joi.date(),   
    taal: Joi.string(),             
    paginas: Joi.number().integer().positive(),          
    vrije_kopieen: Joi.number().integer().min(0),    
    totale_kopieen: Joi.number().integer().min(0),   
    beschrijving: Joi.string(),     
    cover_uri: Joi.string().uri().allow(null),                
    auteur: Joi.object({
      voornaam: Joi.string(),
      achternaam: Joi.string(),
      geboortedatum: Joi.date(),
      nationaliteit: Joi.string(),
      biografie: Joi.string(),
    }),
  },
};

const deleteBoekById= async (ctx: KoaContext<void, IdParams>) => {
  const id : UUID = ctx.params.id;
  await boekenService.deleteById(id);
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

getBoekById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
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

  router.get('/',validate(getAllBoeken.validationScheme), getAllBoeken);
  router.post('/',validate(createBoek.validationScheme), createBoek);
  router.get('/:id',  validate(getBoekById.validationScheme), getBoekById);
  router.delete('/:id', deleteBoekById);
  router.put('/:id',updateBoekById);

  parent.use(router.routes()).use(router.allowedMethods());
};
