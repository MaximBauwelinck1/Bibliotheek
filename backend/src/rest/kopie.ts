import Router from '@koa/router';
import * as kopieService from '../service/kopie';
import { getLogger } from '../core/logging';
import type { BibliotheekAppContext, BibliotheekAppState, KoaRouter,KoaContext } from '../types/koa';
import type { IdParams } from '../types/common';
import Joi from 'joi';
import type { UUID } from 'crypto';
import validate from '../core/validation';
// eslint-disable-next-line @stylistic/max-len
import type { CreateBoekKopieRequest, CreateBoekKopieResponse, GetAllBoekkopieennResponse, GetBoekkopieByIdResponse, UpdateBoekKopieRequest, UpdateBoekKopieResponse } from '../types/boek_kopie';
import { requireAuthentication,makeRequireRole } from '../core/auth';
import roles from '../core/roles';

/**
 * @swagger
 * tags:
 *   name: Boek Kopieën
 *   description: stelt een exemplaar voor in het syteem
 */

/**
 * @swagger
 * /api/kopieen:
 *   get:
 *     summary: Haal alle boek kopieën op
 *     description: Haalt een lijst op van alle beschikbare boek kopieën in het systeem.
 *     tags:
 *       - Boek Kopieën
 *     responses:
 *       401:
 *            $ref: '#/components/responses/401Unauthorized'
 *       200:
 *         description: Een lijst van alle boek kopieën
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BoekKopie'
 *     security:
 *       - bearerAuth: []
 */

const getAllKopieen = async (ctx: KoaContext<GetAllBoekkopieennResponse>) => {
  ctx.body = {
    items: await kopieService.getAll(),
  };
  getLogger().info('Alle Kopieën zijn opgevraagd.');
};
getAllKopieen.validationScheme = null;

/**
 * @swagger
 * /api/kopieen:
 *   post:
 *     summary: Maak een nieuwe boek kopie aan
 *     description: Maakt een nieuwe boek kopie aan voor het opgegeven boek en slaat deze op in het systeem.
 *     tags:
 *       - Boek Kopieën
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               boek_id:
 *                 type: string
 *                 format: uuid
 *                 description: Het ID van het boek waarvoor de kopie wordt aangemaakt
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               status:
 *                 type: string
 *                 enum: ["beschikbaar", "gereserveerd", "niet-beschikbaar"]
 *                 description: De status van de boek kopie
 *                 example: "beschikbaar"
 *               extra_informatie:
 *                 type: string
 *                 description: Extra informatie over de boek kopie
 *                 example: "Lichte beschadiging op de kaft"
 *     responses:
 *       401:
 *            $ref: '#/components/responses/401Unauthorized'
 *       201:
 *         description: De boek kopie is succesvol aangemaakt
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BoekKopie'
 *     security:
 *       - bearerAuth: []
 */

const createKopie = async (ctx: KoaContext<CreateBoekKopieResponse, void, CreateBoekKopieRequest>) => {
  const nieuwKopie = await kopieService.create({
    ...ctx.request.body,
  });
  ctx.body = nieuwKopie;
  ctx.status = 201;
  getLogger().info(`Kopie met id:${nieuwKopie.id} is succesvol aangemaakt.`);
};

createKopie.validationScheme = {
  body: {            
    boek_id: Joi.string().uuid(),            
    status: Joi.string().valid('beschikbaar','gereserveerd','niet-beschikbaar'),                
    extra_informatie: Joi.string().optional(),          
  },
};

/**
 * @swagger
 * /api/kopieen/{id}:
 *   delete:
 *     summary: Verwijder een boek kopie op basis van ID(soft Delete)
 *     description: Verwijdert de boek kopie met het opgegeven ID uit het systeem.
 *     tags:
 *       - Boek Kopieën
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Het ID van de boek kopie die verwijderd moet worden.
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       401:
 *             $ref: '#/components/responses/401Unauthorized'
 *       204:
 *         description: De boek kopie is succesvol verwijderd.
 *       404:
 *         description: De boek kopie met het opgegeven ID is niet gevonden.
 *     security:
 *       - bearerAuth: []
 */

const deleteKopieById= async (ctx: KoaContext<void, IdParams>) => {
  const id : UUID = ctx.params.id;
  await kopieService.deleteById(id);
  ctx.status = 204;
  getLogger().info(`Kopie met id:${ctx.params.id} is succesvol verwijderd.`);
};
deleteKopieById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};
/**
 * @swagger
 * /api/kopieen/{id}:
 *   get:
 *     summary: Haal een boek kopie op basis van ID
 *     description: Haalt de boek kopie op met het opgegeven ID uit het systeem.
 *     tags:
 *       - Boek Kopieën
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Het ID van de boek kopie die opgehaald moet worden.
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       401:
 *             $ref: '#/components/responses/401Unauthorized'
 *       200:
 *         description: De boek kopie is succesvol opgehaald.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BoekKopie'
 *       404:
 *         description: De boek kopie met het opgegeven ID is niet gevonden.
 *     security:
 *       - bearerAuth: []
 */

const getKopieById = async (ctx: KoaContext<GetBoekkopieByIdResponse, IdParams>) => {
  const id : UUID = ctx.params.id;
  const opt_res =await  kopieService.getById(id);
  ctx.body = opt_res;
  getLogger().info(`Kopie met id:${ctx.params.id} is geretourneerd.`);
};

getKopieById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
};
/**
 * @swagger
 * /api/kopieen/{id}:
 *   put:
 *     summary: Update een boek kopie op basis van ID
 *     description: Werk de boek kopie bij met nieuwe gegevens, zoals de status en extra informatie.
 *     tags:
 *       - Boek Kopieën
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Het ID van de boek kopie die geüpdatet moet worden.
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - beschikbaar
 *                   - gereserveerd
 *                   - niet-beschikbaar
 *                 description: De status van de boek kopie die geüpdatet moet worden.
 *               extra_informatie:
 *                 type: string
 *                 nullable: true
 *                 description: Extra informatie over de boek kopie (optioneel).
 *     responses:
 *       401:
 *            $ref: '#/components/responses/401Unauthorized'
 *       200:
 *         description: De boek kopie is succesvol geüpdatet.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BoekKopie'
 *       404:
 *         description: De boek kopie met het opgegeven ID is niet gevonden.
 *       400:
 *         description: De opgegeven gegevens zijn ongeldig.
 *     security:
 *       - bearerAuth: []
 */

const updateKopieById = async( ctx: KoaContext<UpdateBoekKopieResponse, IdParams, UpdateBoekKopieRequest>) => {
  const id : UUID = ctx.params.id;
  const opt_res =await  kopieService.updateById(id, {...ctx.request.body});
  ctx.body = opt_res;
  getLogger().info(`Kopie met id:${ctx.params.id} is succesvol geupdate.`);
};

updateKopieById.validationScheme = {
  params: {
    id: Joi.string().uuid(),
  },
  body: {                    
    status: Joi.string().valid('beschikbaar','gereserveerd','niet-beschikbaar').optional(),                
    extra_informatie: Joi.string().optional(),      
  },
};

export default (parent: KoaRouter) => {
  const router = new Router<BibliotheekAppState, BibliotheekAppContext>({
    prefix: '/kopieen',
  });

  const requireAdmin = makeRequireRole(roles.ADMIN);
  router.use(requireAuthentication);
  router.get('/',validate(getAllKopieen.validationScheme), getAllKopieen);
  router.post('/',requireAdmin, validate(createKopie.validationScheme), createKopie);
  router.get('/:id',  validate(getKopieById.validationScheme), getKopieById);
  router.delete('/:id',requireAdmin,  validate(deleteKopieById.validationScheme), deleteKopieById);
  router.put('/:id',requireAdmin, validate(updateKopieById.validationScheme),updateKopieById);

  parent.use(router.routes()).use(router.allowedMethods());
};
