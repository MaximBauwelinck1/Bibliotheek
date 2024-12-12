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

/**
 * @swagger
 * tags:
 *   name: Gebruikers
 *   description: Stelt een gebruiker voor in het systeem
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Gebruiker:
 *       type: object
 *       required:
 *         - voornaam
 *         - achternaam
 *         - geboortedatum
 *         - email
 *         - rol
 *         - aangemaakt
 *         - upgedate
 *         - actief
 *       properties:
 *         voornaam:
 *           type: string
 *           description: De voornaam van de gebruiker.
 *           example: Jan
 *         achternaam:
 *           type: string
 *           description: De achternaam van de gebruiker.
 *           example: Jansen
 *         geboortedatum:
 *           type: string
 *           format: date
 *           description: De geboortedatum van de gebruiker.
 *           example: 1990-01-15
 *         email:
 *           type: string
 *           format: email
 *           description: Het e-mailadres van de gebruiker.
 *           example: jan.jansen@example.com
 *         rol:
 *           type: string
 *           enum:
 *             - user
 *             - admin
 *           description: De rol van de gebruiker in het systeem. Kan alleen 'user' of 'admin' zijn.
 *           example: admin
 *         aangemaakt:
 *           type: string
 *           format: date-time
 *           description: De datum en tijdstip waarop de gebruiker is aangemaakt.
 *           example: 2023-12-01T14:23:00Z
 *         upgedate:
 *           type: string
 *           format: date-time
 *           description: De datum en tijdstip waarop de gebruiker voor het laatst is bijgewerkt.
 *           example: 2023-12-11T09:45:00Z
 *         actief:
 *           type: boolean
 *           description: Geeft aan of de gebruiker actief is.
 *           example: true
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     GebruikerLijst:
 *       type: object
 *       required:
 *         - items
 *       properties:
 *         items:
 *           type: array
 *           description: Lijst van gebruikers
 *           items:
 *             $ref: '#/components/schemas/Gebruiker'
 */

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
/**
 * @swagger
 * /api/gebruikers:
 *   get:
 *     summary: Haal een lijst van alle gebruikers op
 *     description: Deze route haalt alle gebruikers op en retourneert ze als een lijst van public gebruikers.
 *     tags:
 *        - Gebruikers
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       401:
 *            $ref: '#/components/responses/401Unauthorized'
 *       200:
 *         description: Een lijst van gebruikers is succesvol opgehaald.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GebruikerLijst'
 *       500:
 *         description: Er is een interne serverfout opgetreden.
 */

const getAllGebruikers = async (ctx: KoaContext<GetAllgebruikersResponse>) => {
  ctx.body = {
    items: await gebruikerService.getAll(),
  };
  getLogger().info('Alle gebruikers zijn opgevraagd.');
};
getAllGebruikers.validationScheme = null;

/**
 * @swagger
 * /api/gebruikers/{id}/reservaties:
 *   get:
 *     summary: Haal alle reservaties van een gebruiker op
 *     description: Haal alle reservaties op van een specifieke gebruiker, inclusief de status en de boek kopieën.
 *     tags:
 *       - Gebruikers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Het ID van de gebruiker waarvan de reservaties opgehaald moeten worden. Als 'me' wordt gebruikt, worden de reservaties van de ingelogde gebruiker opgehaald.
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Een lijst van reservaties van de opgegeven gebruiker.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Reservatie'
 *       404:
 *         description: De gebruiker met het opgegeven ID is niet gevonden of heeft geen reservaties.
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 *     security:
 *       - bearerAuth: []
 *     401:
 *       $ref: '#/components/responses/401Unauthorized'
 */

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
/**
 * @swagger
 * /api/gebruikers/register:
 *   post:
 *     summary: Registreer een nieuwe gebruiker
 *     description: Deze route registreert een nieuwe gebruiker en retourneert een JWT-token voor authenticatie.
 *     tags:
 *       - Gebruikers
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - voornaam
 *               - achternaam
 *               - geboortedatum
 *               - email
 *               - password
 *             properties:
 *               voornaam:
 *                 type: string
 *                 description: De voornaam van de gebruiker.
 *               achternaam:
 *                 type: string
 *                 description: De achternaam van de gebruiker.
 *               geboortedatum:
 *                 type: string
 *                 format: date
 *                 description: Geboortedatum van de gebruiker (maximaal de huidige datum).
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Het emailadres van de gebruiker.
 *               rol:
 *                 type: string
 *                 enum: 
 *                   - user
 *                   - admin
 *                 description: De rol van de gebruiker (optioneel, standaard is 'user').
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 maxLength: 128
 *                 description: Het wachtwoord van de gebruiker (minimaal 8 tekens).
 *     responses:
 *       201:
 *         description: De gebruiker is succesvol geregistreerd en het token wordt geretourneerd.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Het JWT-token van de geregistreerde gebruiker.
 *       400:
 *         description: Ongeldige Data in body.
 *       500:
 *         description: Er is een interne serverfout opgetreden.
 */

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

/**
 * @swagger
 * /api/gebruikers/{id}:
 *   delete:
 *     summary: Verwijder een gebruiker (soft delete)
 *     description: Verwijdert een gebruiker door middel van soft delete. Als de ID "me" is, verwijdert het de ingelogde gebruiker.
 *     tags:
 *       - Gebruikers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: De ID van de gebruiker die verwijderd moet worden, of "me" voor de ingelogde gebruiker.
 *         schema:
 *           type: string
 *           enum: 
 *             - me
 *             - <uuid>  # Vul dit aan met een beschrijving over het UUID-formaat
 *     responses:
 *       204:
 *         description: De gebruiker is succesvol verwijderd (soft delete).
 *       400:
 *         description: Ongeldige gebruiker ID of verzoekparameters.
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 *       404:
 *         description: De opgegeven gebruiker is niet gevonden.
 *       500:
 *         description: Er is een interne serverfout opgetreden.
 */

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
/**
 * @swagger
 * /api/gebruikers/{id}:
 *   get:
 *     summary: Haal een gebruiker op
 *     description: Haal een gebruiker op via het ID. Als het ID "me" is, wordt de ingelogde gebruiker opgevraagd.
 *     tags:
 *       - Gebruikers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: De ID van de gebruiker die opgehaald moet worden, of "me" voor de ingelogde gebruiker.
 *         schema:
 *           type: string
 *           enum: 
 *             - me
 *             - <uuid>  # Vul dit aan met een beschrijving over het UUID-formaat
 *     responses:
 *       200:
 *         description: De gegevens van de opgevraagde gebruiker.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Gebruiker'
 *       400:
 *         description: Ongeldige gebruiker ID of verzoekparameters.
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 *       404:
 *         description: De opgegeven gebruiker is niet gevonden.
 *       500:
 *         description: Er is een interne serverfout opgetreden.
 */

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
/**
 * @swagger
 * /api/gebruikers/{id}:
 *   put:
 *     summary: Werk de gegevens van een gebruiker bij
 *     description: Werk de gegevens van een gebruiker bij op basis van het opgegeven ID. Als het ID "me" is, wordt de ingelogde gebruiker bijgewerkt.
 *     tags:
 *       - Gebruikers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: De ID van de gebruiker die geüpdatet moet worden, of "me" voor de ingelogde gebruiker.
 *         schema:
 *           type: string
 *           enum:
 *             - me
 *             - <uuid>  # Vul dit aan met een beschrijving over het UUID-formaat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               voornaam:
 *                 type: string
 *               achternaam:
 *                 type: string
 *               geboortedatum:
 *                 type: string
 *                 format: date
 *               email:
 *                 type: string
 *                 format: email
 *               rol:
 *                 type: string
 *                 enum:
 *                   - user
 *                   - admin
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 maxLength: 128
 *             required: []
 *     responses:
 *       200:
 *         description: De gebruiker is succesvol geüpdatet.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Gebruiker'
 *       400:
 *         description: Ongeldige gebruiker ID of verzoekparameters.
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 *       404:
 *         description: De opgegeven gebruiker is niet gevonden.
 *       500:
 *         description: Er is een interne serverfout opgetreden.
 */

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

/**
 * @swagger
 * /api/forgot-password:
 *   post:
 *     summary: Stuur een reset wachtwoord e-mail
 *     description: Verstuurt een e-mail naar het opgegeven e-mailadres om het wachtwoord opnieuw in te stellen, indien het e-mailadres bestaat.
 *     tags:
 *       - Gebruikers
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Het e-mailadres van de gebruiker waarvoor het wachtwoord opnieuw moet worden ingesteld.
 *             required:
 *               - email
 *     responses:
 *       201:
 *         description: Een reset wachtwoord e-mail is succesvol verstuurd.
 *       400:
 *         description: Ongeldige e-mail adres.
 *       500:
 *         description: Er is een interne serverfout opgetreden.
 */

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
/**
 * @swagger
 * /api/reset-password:
 *   post:
 *     summary: Reset wachtwoord met geldige token
 *     description: Reset het wachtwoord van een gebruiker met een geldig reset token.
 *     tags:
 *       - Gebruikers
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: Het nieuwe wachtwoord van de gebruiker.
 *               token:
 *                 type: string
 *                 description: De reset-token die eerder naar de gebruiker is verzonden.
 *             required:
 *               - password
 *               - token
 *     responses:
 *       201:
 *         description: Het wachtwoord is succesvol gereset.
 *       400:
 *         description: Ongeldige wachtwoord of token.
 *       404:
 *         description: Reset token niet gevonden of verlopen.
 *       500:
 *         description: Er is een interne serverfout opgetreden.
 */

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
