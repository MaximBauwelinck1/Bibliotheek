import Router from '@koa/router';
import * as boekenService from '../service/boek';
import { getLogger } from '../core/logging';
import type { UUID } from 'crypto';
import type { BibliotheekAppContext, BibliotheekAppState, KoaContext, KoaRouter } from '../types/koa';
// eslint-disable-next-line @stylistic/max-len
import type { CreateBoekRequest, CreateBoekResponse, GetAllBoekenResponse, GetBoekByIdResponse, UpdateBoekRequest, UpdateBoekResponse } from '../types/boek';
import type { BoekKopieIdParams, IdParams } from '../types/common';
import Joi from 'joi';
import validate from '../core/validation';
import type { GetAllBoekkopieennResponse, GetBoekkopieByIdResponse } from '../types/boek_kopie';
import { requireAuthentication,makeRequireRole } from '../core/auth';
import roles from '../core/roles';

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

const getAllBoekkopieen = async (ctx: KoaContext<GetAllBoekkopieennResponse>) => {
  ctx.body = {
    items: await boekenService.getAllBoekKopieen(),
  };
  getLogger().info('Alle boek kopieên zijn opgevraagd.');
};
getAllBoekkopieen.validationScheme = null;

const createBoek = async (ctx: KoaContext<CreateBoekResponse, void, CreateBoekRequest>) => {
  const nieuwBoek = await boekenService.create({
    ...ctx.request.body,
  });
  ctx.body = nieuwBoek;
  ctx.status = 201;
  getLogger().info(`boek met id:${nieuwBoek.id} is succesvol aangemaakt.`);
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
            return true; // algoritme om isbn 10 te checken werkt
          }
          return false;
          
        };

        if (!isValidISBN(value)) {
          throw new Error('Het ISBN formaat is ongeldig');
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
        'Avontuur','Memoir','Thriller',
      ),            
    publicatie_datum: Joi.date(),   
    taal: Joi.string().valid(
      'Nederlands','Frans','Engels','Zweeds','Duits','Russisch','Portugees',
    ),             
    paginas: Joi.number().integer().positive(),             
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
  ctx.status = 204;
  getLogger().info(`boek met id:${ctx.params.id} is succesvol verwijderd.`);
};
deleteBoekById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};
const getBoekById = async (ctx: KoaContext<GetBoekByIdResponse, IdParams>) => {
  const id : UUID = ctx.params.id;
  const opt_res =await  boekenService.getById(id);
  ctx.body = opt_res;
  getLogger().info(`boek met id:${ctx.params.id} is geretourneerd.`);
};

getBoekById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};
const getAllBoekKopieenFromBoek = async (ctx: KoaContext<GetAllBoekkopieennResponse, IdParams>) => {
  const id : UUID = ctx.params.id;
  const opt_res =await  boekenService.getAllBoekKopieenFromBoek(id);
  ctx.body= {
    items: opt_res,
  };
  getLogger().info(`alle boek kopieen van boek:${ctx.params.id} zijn geretourneerd.`);
};

getAllBoekKopieenFromBoek.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};

const getBoekKopieById = async (ctx: KoaContext<GetBoekkopieByIdResponse, BoekKopieIdParams>) => {
  const boekId : UUID = ctx.params.boekId;
  const boekKopieid : UUID = ctx.params.boekKopieId;
  const opt_res =await  boekenService.getBoekKopieById(boekId,boekKopieid);
  ctx.body = opt_res;
  getLogger().info(`boek kopie met id:${ctx.params.boekKopieId} is geretourneerd.`);
};

getBoekKopieById.validationScheme = {
  params: {
    boekId: Joi.string().uuid(),
    boekKopieId: Joi.string().uuid(),
  },
};

const delRandomKopie = async (ctx: KoaContext< void,IdParams>) => {
  const boekId : UUID = ctx.params.id;
  await  boekenService.deleteRandomBeschikbareKopie(boekId);
  ctx.status = 204;
  getLogger().info('Een boek kopie is succesvol is verwijderd.');
};

delRandomKopie.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};
const updateBoekById = async( ctx: KoaContext<UpdateBoekResponse, IdParams, UpdateBoekRequest>) => {
  const id : UUID = ctx.params.id;
  const opt_res =await  boekenService.updateById(id, {...ctx.request.body});
  ctx.body = opt_res;
  getLogger().info(`boek met id:${ctx.params.id} is succesvol geupdate.`);
};

updateBoekById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
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
            return true; // algoritme om isbn 10 te checken werkt niet
             
          }
          return false; 
          
        };

        if (!isValidISBN(value)) {
          throw new Error('Het ISBN formaat is ongeldig'); // geen geldig isbn formaat
        }
        return value; 
      }).optional(),
    titel: Joi.string().optional(),            
    genre: Joi.string()
      .valid(
        'Fictie', 'non fictie', 'Mysterie', 'Fantasie', 
        'Science fiction', 'Biografie', 'Romantiek', 
        'Geschiedenis', 'Dystopisch', 'Souterh- gothic', 
        'post-apocaliptisch', 'anti-war', 'tragedie', 
        'Avontuur','Memoir','Thriller',
      ).optional(),            
    publicatie_datum: Joi.date().optional(),   
    taal: Joi.string().valid(
      'Nederlands','Frans','Engels','Zweeds','Duits','Russisch','Portugees',
    ).optional(),             
    paginas: Joi.number().integer().positive().optional(),          
    beschrijving: Joi.string().optional(),     
    cover_uri: Joi.string().uri().allow(null).optional(),                
    auteur: Joi.object({
      voornaam: Joi.string().optional(),
      achternaam: Joi.string().optional(),
      geboortedatum: Joi.date().optional(),
      nationaliteit: Joi.string().optional(),
      biografie: Joi.string().optional(),
    }).optional(),
  },
};

export default (parent: KoaRouter) => {
  const router = new Router<BibliotheekAppState, BibliotheekAppContext>({
    prefix: '/boeken',
  });

  const requireAdmin = makeRequireRole(roles.ADMIN);
  router.delete('/:id/beschikbaarkopie',requireAuthentication, requireAdmin,
    validate(delRandomKopie.validationScheme),delRandomKopie);//admin nodig om dit te deleten

  router.get('/kopieen',requireAuthentication, validate(getAllBoekkopieen.validationScheme),getAllBoekkopieen);
  //TODO nakijken of dit admin permissie nodig heeft of niet
  router.get('/:id/kopieen',requireAuthentication,
    validate(getAllBoekKopieenFromBoek.validationScheme),getAllBoekKopieenFromBoek);

  router.get('/:boekId/kopieen/:boekKopieId',requireAuthentication,
    validate(getBoekKopieById.validationScheme),getBoekKopieById);

  router.get('/',validate(getAllBoeken.validationScheme), getAllBoeken);
  //moet niet ingelogd zijn om alle boeken te bekijken

  router.post('/',requireAuthentication,requireAdmin, validate(createBoek.validationScheme), createBoek);
  router.get('/:id',  validate(getBoekById.validationScheme), getBoekById);
  //hiervoor moet je ook niet ingelogd zijn
  router.delete('/:id',requireAuthentication,requireAdmin,validate(deleteBoekById.validationScheme), deleteBoekById);
  router.put('/:id',requireAuthentication,requireAdmin,validate(updateBoekById.validationScheme),updateBoekById);
  parent.use(router.routes()).use(router.allowedMethods());
};
