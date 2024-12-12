import Router from '@koa/router';
import * as reservatieService from '../service/reservatie';
import { getLogger } from '../core/logging';
import type { UUID } from 'crypto';
import type { BibliotheekAppContext, BibliotheekAppState, KoaContext, KoaRouter } from '../types/koa';
import type { IdParams } from '../types/common';
import Joi from 'joi';
import validate from '../core/validation';
import { requireAuthentication,makeRequireRole } from '../core/auth';
// eslint-disable-next-line @stylistic/max-len
import type { CreateReservatieRequest, CreateReservatieResponse, GetAllReservatiesResponse, GetReservatieByIdResponse, UpdateReservatieRequest, UpdateReservatieResponse } from '../types/reservatie';
import roles from '../core/roles';

/**
 * @swagger
 * tags:
 *   name: Reservaties
 *   description: Stelt een reservatie voor in het systeem
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Reservatie:
 *       type: object
 *       properties:
 *         boek_kopie:
 *           $ref: '#/components/schemas/BoekKopie'
 *           description: De boek kopie die gereserveerd is.
 *         gebruiker:
 *           $ref: '#/components/schemas/Gebruiker'
 *           description: De gebruiker die de boek kopie heeft gereserveerd.
 *         startdatum:
 *           type: string
 *           format: date
 *           description: De datum waarop de reservatie begint.
 *           example: "2024-12-15"
 *         einddatum:
 *           type: string
 *           format: date
 *           description: De datum waarop de reservatie eindigt.
 *           example: "2024-12-22"
 *         status:
 *           type: string
 *           enum:
 *             - actief
 *             - niet-actief
 *           description: De status van de reservatie (kan 'actief' of 'niet-actief' zijn).
 *           example: "actief"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ReservatieLijst:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Reservatie'
 *           description: Een lijst van reservaties.
 */

/**
 * @swagger
 * /api/reservaties:
 *   get:
 *     summary: Haal een lijst van alle reservaties op
 *     description: Haal een lijst op van alle reservaties in het systeem.
 *     tags:
 *       - Reservaties
 *     responses:
 *       200:
 *         description: Lijst van alle reservaties.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReservatieLijst'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 *     security:
 *       - bearerAuth: []
 */

const getAllReservaties = async (ctx: KoaContext<GetAllReservatiesResponse>) => {
  ctx.body = {
    items: await reservatieService.getAll(),
  };
  getLogger().info('Alle reservaties zijn opgevraagd.');
};
getAllReservaties.validationScheme = null;

/**
 * @swagger
 * /api/reservaties:
 *   post:
 *     summary: Maak een nieuwe reservatie aan
 *     description: Maak een nieuwe reservatie voor een boek kopie door de gegevens van de gebruiker en de boek kopie te verstrekken.
 *     tags:
 *       - Reservaties
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               boek_kopie_id:
 *                 type: string
 *                 format: uuid
 *                 description: Het ID van de boek kopie die gereserveerd wordt (optioneel, indien boek_id niet gespecificeerd is).
 *               boek_id:
 *                 type: string
 *                 format: uuid
 *                 description: Het ID van het boek dat gereserveerd wordt (optioneel, indien boek_kopie_id niet gespecificeerd is).
 *               gebruiker_id:
 *                 type: string
 *                 format: uuid
 *                 description: Het ID van de gebruiker die de reservering maakt.
 *               einddatum:
 *                 type: string
 *                 format: date
 *                 description: De einddatum van de reservatie (moet in de toekomst liggen).
 *               status:
 *                 type: string
 *                 enum:
 *                   - actief
 *                   - niet-actief
 *                 description: De status van de reservatie.
 *     responses:
 *       201:
 *         description: De nieuwe reservatie is succesvol aangemaakt.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservatie'
 *       400:
 *         description: De opgegeven gegevens zijn ongeldig.
 *       404:
 *         description: Boek of gebruiker niet gevonden.
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 *     security:
 *       - bearerAuth: []
 */

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
    boek_kopie_id: Joi.string().uuid().optional(), 
    boek_id: Joi.string().uuid().optional(),                   
    gebruiker_id: Joi.string().uuid(),    
    einddatum: Joi.date().min(new Date().setHours(0,0,0,0)),   
    status: Joi.string().valid('actief','niet-actief'),     
  },
};
/**
 * @swagger
 * /api/reservaties/{id}:
 *   delete:
 *     summary: Zet een reservatie op niet-actief en herstel de beschikbaarheid van de boek kopie
 *     description: Zet een reservatie op niet-actief en update de status van de boek kopie zodat deze weer beschikbaar is. Het aantal vrije kopieën van het boek wordt ook aangepast.
 *     tags:
 *       - Reservaties
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Het ID van de reservatie die verwijderd moet worden.
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       204:
 *         description: De reservatie is succesvol op niet-actief gezet en de boek kopie is hersteld naar beschikbaar.
 *       404:
 *         description: De reservatie met het opgegeven ID is niet gevonden.
 *       400:
 *         description: De opgegeven gegevens zijn ongeldig.
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 *     security:
 *       - bearerAuth: []
 */

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
/**
 * @swagger
 * /api/reservaties/{id}:
 *   get:
 *     summary: Haal een specifieke reservatie op basis van ID
 *     description: Haal de details op van een specifieke reservatie door het ID van de reservatie op te geven.
 *     tags:
 *       - Reservaties
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Het ID van de reservatie die opgehaald moet worden.
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: De gevraagde reservatie is succesvol opgehaald.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservatie'
 *       404:
 *         description: De reservatie met het opgegeven ID is niet gevonden.
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 *     security:
 *       - bearerAuth: []
 */

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
/**
 * @swagger
 * /api/reservaties/{id}:
 *   put:
 *     summary: Update een reservatie op basis van ID
 *     description: Werk de gegevens van een reservatie bij met nieuwe gegevens, zoals de einddatum en status.
 *     tags:
 *       - Reservaties
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Het ID van de reservatie die geüpdatet moet worden.
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               einddatum:
 *                 type: string
 *                 format: date
 *                 description: De nieuwe einddatum van de reservatie. Het moet een datum zijn die gelijk of groter is dan de huidige datum.
 *               status:
 *                 type: string
 *                 enum:
 *                   - actief
 *                   - niet-actief
 *                 description: De status van de reservatie die geüpdatet moet worden.
 *     responses:
 *       200:
 *         description: De reservatie is succesvol geüpdatet.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reservatie'
 *       404:
 *         description: De reservatie met het opgegeven ID is niet gevonden.
 *       400:
 *         description: De opgegeven gegevens zijn ongeldig.
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 *     security:
 *       - bearerAuth: []
 */

const updateReservatieyId = async( ctx: KoaContext<UpdateReservatieResponse, IdParams, UpdateReservatieRequest>) => {
  const id : UUID = ctx.params.id;
  const opt_res =await  reservatieService.updateById(id, {...ctx.request.body});
  ctx.body = opt_res;
  getLogger().info(`reservatie met id:${ctx.params.id} is succesvol geupdate.`);
};

updateReservatieyId.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
  body: {   
    einddatum: Joi.date().min(new Date().setHours(0,0,0,0)).optional(),   
    status: Joi.string().valid('actief','niet-actief'),  
  },
};

export default (parent: KoaRouter) => {
  const router = new Router<BibliotheekAppState, BibliotheekAppContext>({
    prefix: '/reservaties',
  });

  const requireAdmin = makeRequireRole(roles.ADMIN);
  router.use(requireAuthentication);
  router.get('/',requireAdmin, validate(getAllReservaties.validationScheme), getAllReservaties);
  router.post('/',validate(createReservatie.validationScheme), createReservatie);
  router.get('/:id',  validate(getReservatieById.validationScheme), getReservatieById);
  router.delete('/:id',requireAdmin, validate(deleteReservatieById.validationScheme), deleteReservatieById);
  router.put('/:id',validate(updateReservatieyId.validationScheme),updateReservatieyId);

  parent.use(router.routes()).use(router.allowedMethods());
};
