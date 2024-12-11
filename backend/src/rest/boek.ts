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

/**
 * @swagger
 * tags:
 *   name: Boeken
 *   description: Alles rond boeken en hun auteurs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Boek:
 *       type: object
 *       required:
 *         - ISBN
 *         - titel
 *         - genre
 *         - publicatie_datum
 *         - taal
 *         - paginas
 *         - vrije_kopieen
 *         - totale_kopieen
 *         - beschrijving
 *         - aangemaakt
 *         - upgedate
 *         - auteur
 *         - actief
 *       properties:
 *         ISBN:
 *           type: string
 *           description: Unieke identificatie van het boek.
 *         titel:
 *           type: string
 *           description: Titel van het boek.
 *         genre:
 *           type: string
 *           enum: 
 *             - Fictie
 *             - non fictie
 *             - Mysterie
 *             - Fantasie
 *             - Science fiction
 *             - Biografie
 *             - Romantiek
 *             - Geschiedenis
 *             - Dystopisch
 *             - Souterh- gothic
 *             - post-apocaliptisch
 *             - anti-war
 *             - tragedie
 *             - Avontuur
 *             - Memoir
 *             - Thriller
 *           description: Genre van het boek.
 *         publicatie_datum:
 *           type: string
 *           format: date
 *           description: Publicatiedatum van het boek.
 *         taal:
 *           type: string
 *           enum:
 *             - Nederlands
 *             - Frans
 *             - Engels
 *             - Zweeds
 *             - Duits
 *             - Russisch
 *             - Portugees
 *           description: De taal waarin het boek is geschreven.
 *         paginas:
 *           type: integer
 *           description: Aantal pagina's in het boek.
 *           example: 300
 *         vrije_kopieen:
 *           type: integer
 *           description: Het aantal vrije kopieën dat beschikbaar is.
 *           example: 5
 *         totale_kopieen:
 *           type: integer
 *           minimum: 0
 *           description: Het totale aantal kopieën dat beschikbaar is.
 *           example: 10
 *         beschrijving:
 *           type: string
 *           description: Beschrijving van het boek.
 *           example: Een spannende roman over mysterie en avontuur.
 *         cover_uri:
 *           type: string
 *           format: uri
 *           nullable: true
 *           description: URI naar de coverafbeelding van het boek.
 *           example: "https://example.com/covers/boek123.jpg"
 *         aangemaakt:
 *           type: string
 *           format: date-time
 *           description: Datum en tijdstip waarop het boek is aangemaakt.
 *         upgedate:
 *           type: string
 *           format: date-time
 *           description: Datum en tijdstip van de laatste update van het boek.
 *         auteur:
 *           $ref: '#/components/schemas/Auteur'
 *         actief:
 *           type: boolean
 *           description: Geeft aan of het boek actief is.
 *     BoekenLijst:
 *       type: object
 *       required:
 *         - items
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Boek'
 *       description: Een lijst van boeken.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Auteur:
 *       type: object
 *       required:
 *         - voornaam
 *         - achternaam
 *         - geboortedatum
 *         - nationaliteit
 *         - aangemaakt
 *         - upgedate
 *       properties:
 *         voornaam:
 *           type: string
 *           description: De voornaam van de auteur.
 *           example: "John"
 *         achternaam:
 *           type: string
 *           description: De achternaam van de auteur.
 *           example: "Doe"
 *         geboortedatum:
 *           type: string
 *           format: date
 *           description: De geboortedatum van de auteur.
 *           example: "1975-05-20"
 *         nationaliteit:
 *           type: string
 *           description: De nationaliteit van de auteur.
 *           example: "Belgisch"
 *         biografie:
 *           type: string
 *           nullable: true
 *           description: Een korte biografie van de auteur.
 *           example: "Auteur van meerdere bekroonde romans."
 *         aangemaakt:
 *           type: string
 *           format: date-time
 *           description: Datum en tijdstip waarop de auteur werd aangemaakt in het systeem.
 *         upgedate:
 *           type: string
 *           format: date-time
 *           description: Datum en tijdstip van de laatste update van de auteur.
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     BoekKopie:
 *       type: object
 *       required:
 *         - boek
 *         - status
 *         - aangemaakt
 *         - upgedate
 *         - actief
 *       properties:
 *         boek:
 *           $ref: '#/components/schemas/Boek'
 *           description: Het boek waarvoor de kopie is.
 *         status:
 *           type: string
 *           description: De status van de boek kopie (bijvoorbeeld "Beschikbaar", "Uitgeleend", etc.).
 *         extra_informatie:
 *           type: string
 *           nullable: true
 *           description: Eventuele extra informatie over de kopie van het boek.
 *           example: "Boek met beschadigde kaft"
 *         aangemaakt:
 *           type: string
 *           format: date-time
 *           description: Datum en tijd waarop de kopie is aangemaakt.
 *         upgedate:
 *           type: string
 *           format: date-time
 *           description: Datum en tijd van de laatste update van de kopie.
 *         actief:
 *           type: boolean
 *           description: Geeft aan of de kopie actief is (bijvoorbeeld beschikbaar voor uitlening).
 *           example: true
 */

/**
 * @swagger
 * /api/boeken:
 *   get:
 *     summary: Geeft alle boeken
 *     tags:
 *       - Boeken
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lijst met boeken
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BoekenLijst"
 *       400:
 *         $ref: '#/components/responses/400BadRequest'
 */
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

/**
 * @swagger
 * /boeken/kopieen:
 *   get:
 *     summary: Haal alle boek kopieën op
 *     description: Haalt een lijst op van alle boek kopieën die beschikbaar zijn in het systeem.
 *     tags:
 *         - Boeken
 *     responses:
 *       401:
 *            $ref: '#/components/responses/401Unauthorized'
 *       200:
 *         description: Een lijst van boek kopieën.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BoekKopie'
 *                   description: Lijst van alle boek kopieën in het systeem.
 *       500:
 *         description: Interne serverfout.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Foutbericht.
 *                   example: 'Er is een fout opgetreden bij het ophalen van de boek kopieën.'
 */

const getAllBoekkopieen = async (ctx: KoaContext<GetAllBoekkopieennResponse>) => {
  ctx.body = {
    items: await boekenService.getAllBoekKopieen(),
  };
  getLogger().info('Alle boek kopieên zijn opgevraagd.');
};
getAllBoekkopieen.validationScheme = null;

/**
 * @swagger
 * paths:
 *   /boeken:
 *     post:
 *       summary: Creëer een nieuw boek
 *       description: Voegt een nieuw boek toe aan de bibliotheek.
 *       tags:
 *         - Boeken
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - ISBN
 *                 - titel
 *                 - genre
 *                 - publicatie_datum
 *                 - taal
 *                 - paginas
 *                 - totale_kopieen
 *                 - beschrijving
 *                 - auteur
 *               properties:
 *                 ISBN:
 *                   type: string
 *                   description: Het unieke ISBN-nummer van het boek. Ondersteunt ISBN-10 en ISBN-13.
 *                   example: "9783161484100"
 *                 titel:
 *                   type: string
 *                   description: De titel van het boek.
 *                   example: "De verborgen waarheid"
 *                 genre:
 *                   type: string
 *                   enum: 
 *                     - Fictie
 *                     - non fictie
 *                     - Mysterie
 *                     - Fantasie
 *                     - Science fiction
 *                     - Biografie
 *                     - Romantiek
 *                     - Geschiedenis
 *                     - Dystopisch
 *                     - Souterh- gothic
 *                     - post-apocaliptisch
 *                     - anti-war
 *                     - tragedie
 *                     - Avontuur
 *                     - Memoir
 *                     - Thriller
 *                   description: Het genre van het boek.
 *                   example: "Fictie"
 *                 publicatie_datum:
 *                   type: string
 *                   format: date
 *                   description: De publicatiedatum van het boek.
 *                   example: "2023-11-01"
 *                 taal:
 *                   type: string
 *                   enum:
 *                     - Nederlands
 *                     - Frans
 *                     - Engels
 *                     - Zweeds
 *                     - Duits
 *                     - Russisch
 *                     - Portugees
 *                   description: De taal waarin het boek is geschreven.
 *                   example: "Nederlands"
 *                 paginas:
 *                   type: integer
 *                   description: Het aantal pagina's in het boek.
 *                   example: 300
 *                 totale_kopieen:
 *                   type: integer
 *                   minimum: 0
 *                   description: Het totale aantal kopieën van het boek.
 *                   example: 10
 *                 beschrijving:
 *                   type: string
 *                   description: Een korte beschrijving van het boek.
 *                   example: "Een meeslepende roman over avontuur en mysterie."
 *                 cover_uri:
 *                   type: string
 *                   format: uri
 *                   nullable: true
 *                   description: Een URI naar de coverafbeelding van het boek.
 *                   example: "https://example.com/covers/boek123.jpg"
 *                 auteur:
 *                   type: object
 *                   required:
 *                     - voornaam
 *                     - achternaam
 *                     - geboortedatum
 *                     - nationaliteit
 *                   properties:
 *                     voornaam:
 *                       type: string
 *                       description: De voornaam van de auteur.
 *                       example: "John"
 *                     achternaam:
 *                       type: string
 *                       description: De achternaam van de auteur.
 *                       example: "Doe"
 *                     geboortedatum:
 *                       type: string
 *                       format: date
 *                       description: De geboortedatum van de auteur.
 *                       example: "1975-05-20"
 *                     nationaliteit:
 *                       type: string
 *                       description: De nationaliteit van de auteur.
 *                       example: "Belgisch"
 *                     biografie:
 *                       type: string
 *                       nullable: true
 *                       description: Een korte biografie van de auteur.
 *                       example: "Auteur van diverse bekroonde boeken."
 *       responses:
 *         401:
 *            $ref: '#/components/responses/401Unauthorized'
 *         201:
 *           description: Het boek is succesvol aangemaakt.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Boek'
 *         400:
 *           description: Ongeldige inputgegevens.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                     example: "VALIDATION_ERROR"
 *                   message:
 *                     type: string
 *                     example: "Het ISBN formaat is ongeldig."
 *         500:
 *           description: Interne serverfout.
 *         
 */

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

/**
 * @swagger
 * paths:
 *   /boeken/{id}:
 *     delete:
 *       summary: soft delete een boek op basis van ID
 *       description: Verwijdert een specifiek boek uit de bibliotheek op basis van het unieke ID.
 *       tags:
 *         - Boeken
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *             format: uuid
 *           description: Het unieke ID van het boek dat moet worden verwijderd.
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *       responses:
 *         401:
 *            $ref: '#/components/responses/401Unauthorized'
 *         204:
 *           description: Het boek is succesvol verwijderd. Er wordt geen inhoud geretourneerd.
 *         400:
 *           description: Ongeldig ID-formaat.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                     example: "VALIDATION_ERROR"
 *                   message:
 *                     type: string
 *                     example: "Het ID is geen geldige UUID."
 *         404:
 *           description: Boek niet gevonden.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                     example: "NOT_FOUND"
 *                   message:
 *                     type: string
 *                     example: "Boek met ID 123e4567-e89b-12d3-a456-426614174000 niet gevonden."
 *         500:
 *           description: Interne serverfout.
 */

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

/**
 * @swagger
 * paths:
 *   /boeken/{id}:
 *     get:
 *       summary: Haal een boek op basis van ID
 *       description: Retourneert een specifiek boek uit de bibliotheek op basis van het unieke ID.
 *       tags:
 *         - Boeken
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *             format: uuid
 *           description: Het unieke ID van het boek dat moet worden opgehaald.
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *       responses:
 *         200:
 *           description: Het boek is succesvol opgehaald.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Boek"
 *         400:
 *           description: Ongeldig ID-formaat.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                     example: "VALIDATION_ERROR"
 *                   message:
 *                     type: string
 *                     example: "Het ID is geen geldige UUID."
 *         404:
 *           description: Boek niet gevonden.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                     example: "NOT_FOUND"
 *                   message:
 *                     type: string
 *                     example: "Boek met ID 123e4567-e89b-12d3-a456-426614174000 niet gevonden."
 *         500:
 *           description: Interne serverfout.
 */

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

/**
 * @swagger
 * /boeken/{id}/kopieen:
 *   get:
 *     summary: Haal alle boek kopieën van een specifiek boek op
 *     description: Haalt een lijst op van alle boek kopieën van een specifiek boek, geïdentificeerd door zijn unieke ID.
 *     tags:
 *         - Boeken
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Het unieke ID van het boek waarvan de kopieën moeten worden opgehaald.
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       401:
 *            $ref: '#/components/responses/401Unauthorized'
 *       200:
 *         description: Een lijst van boek kopieën van het opgegeven boek.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BoekKopie'
 *                   description: Lijst van boek kopieën voor het opgegeven boek.
 *       400:
 *         description: Ongeldig boek ID opgegeven.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ongeldig boek ID opgegeven."
 *       404:
 *         description: Boek niet gevonden.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Boek niet gevonden."
 *       500:
 *         description: Interne serverfout.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Foutbericht.
 *                   example: 'Er is een fout opgetreden bij het ophalen van de boek kopieën.'
 */

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

/**
 * @swagger
 * /boeken/{boekId}/kopieen/{boekKopieId}:
 *   get:
 *     summary: Haal een specifieke boek kopie op
 *     description: Haalt een specifieke boek kopie op van een specifiek boek, geïdentificeerd door de boek en boek kopie ID's.
 *     tags:
 *         - Boeken
 *     parameters:
 *       - in: path
 *         name: boekId
 *         required: true
 *         description: Het unieke ID van het boek waarvan de kopie moet worden opgehaald.
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: boekKopieId
 *         required: true
 *         description: Het unieke ID van de boek kopie die moet worden opgehaald.
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       401:
 *            $ref: '#/components/responses/401Unauthorized'
 *       200:
 *         description: De specifieke boek kopie is succesvol opgehaald.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BoekKopie'
 *       400:
 *         description: Ongeldige boek of boek kopie ID opgegeven.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ongeldige boek of boek kopie ID opgegeven."
 *       404:
 *         description: Boek kopie niet gevonden voor het opgegeven boek.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Boek kopie niet gevonden."
 *       500:
 *         description: Interne serverfout.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Foutbericht.
 *                   example: 'Er is een fout opgetreden bij het ophalen van de boek kopie.'
 */

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
/**
 * @swagger
 * /boeken/{id}/beschikbaarkopie:
 *   delete:
 *     summary: Verwijder een willekeurige boek kopie
 *     description: Verwijdert een willekeurige boek kopie van het opgegeven boek, geïdentificeerd door het boek ID.
 *     tags:
 *         - Boeken
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Het unieke ID van het boek waarvan een willekeurige kopie moet worden verwijderd.
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       401:
 *            $ref: '#/components/responses/401Unauthorized'
 *       204:
 *         description: Een willekeurige boek kopie is succesvol verwijderd.
 *       400:
 *         description: Ongeldige boek ID opgegeven.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ongeldige boek ID opgegeven."
 *       404:
 *         description: Geen beschikbare boek kopieën gevonden voor het opgegeven boek.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Geen beschikbare boek kopieën gevonden."
 *       500:
 *         description: Interne serverfout.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Foutbericht.
 *                   example: 'Er is een fout opgetreden bij het verwijderen van een boek kopie.'
 */

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

/**
 * @swagger
 * paths:
 *   /boeken/{id}:
 *     put:
 *       summary: Werk een boek bij op basis van ID
 *       description: Update de details van een bestaand boek in de bibliotheek.
 *       tags:
 *         - Boeken
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *             format: uuid
 *           description: Het unieke ID van het boek dat moet worden bijgewerkt.
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *       requestBody:
 *         description: De gegevens van het boek die moeten worden bijgewerkt. Velden zijn optioneel.
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ISBN:
 *                   type: string
 *                   description: Unieke identificatie van het boek (ISBN 10 of 13).
 *                   example: "9783161484100"
 *                 titel:
 *                   type: string
 *                   description: Titel van het boek.
 *                 genre:
 *                   type: string
 *                   enum: 
 *                     - Fictie
 *                     - non fictie
 *                     - Mysterie
 *                     - Fantasie
 *                     - Science fiction
 *                     - Biografie
 *                     - Romantiek
 *                     - Geschiedenis
 *                     - Dystopisch
 *                     - Souterh- gothic
 *                     - post-apocaliptisch
 *                     - anti-war
 *                     - tragedie
 *                     - Avontuur
 *                     - Memoir
 *                     - Thriller
 *                   description: Genre van het boek.
 *                 publicatie_datum:
 *                   type: string
 *                   format: date
 *                   description: Publicatiedatum van het boek.
 *                 taal:
 *                   type: string
 *                   enum:
 *                     - Nederlands
 *                     - Frans
 *                     - Engels
 *                     - Zweeds
 *                     - Duits
 *                     - Russisch
 *                     - Portugees
 *                   description: De taal waarin het boek is geschreven.
 *                 paginas:
 *                   type: integer
 *                   description: Aantal pagina's in het boek.
 *                 beschrijving:
 *                   type: string
 *                   description: Beschrijving van het boek.
 *                 cover_uri:
 *                   type: string
 *                   format: uri
 *                   description: URI naar de coverafbeelding van het boek.
 *                 auteur:
 *                   type: object
 *                   properties:
 *                     voornaam:
 *                       type: string
 *                       description: Voornaam van de auteur.
 *                     achternaam:
 *                       type: string
 *                       description: Achternaam van de auteur.
 *                     geboortedatum:
 *                       type: string
 *                       format: date
 *                       description: Geboortedatum van de auteur.
 *                     nationaliteit:
 *                       type: string
 *                       description: Nationaliteit van de auteur.
 *                     biografie:
 *                       type: string
 *                       nullable: true
 *                       description: Biografie van de auteur.
 *       responses:
 *         401:
 *            $ref: '#/components/responses/401Unauthorized'
 *         200:
 *           description: Het boek is succesvol bijgewerkt.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: "#/components/schemas/Boek"
 *         400:
 *           description: Ongeldige invoer.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                     example: "VALIDATION_ERROR"
 *                   message:
 *                     type: string
 *                     example: "ISBN formaat is ongeldig."
 *         404:
 *           description: Boek niet gevonden.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                     example: "NOT_FOUND"
 *                   message:
 *                     type: string
 *                     example: "Boek met ID 123e4567-e89b-12d3-a456-426614174000 niet gevonden."
 *         500:
 *           description: Interne serverfout.
 */

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
