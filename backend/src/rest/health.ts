import Router from '@koa/router';
import * as healthService from '../service/health';
import type { BibliotheekAppContext, BibliotheekAppState, KoaRouter } from '../types/koa';
import validate from '../core/validation';
import type { KoaContext } from '../types/koa';
import type { Pong,Details } from '../types/health';

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Alle informatie van het systeem/applicatie
 */

/**
 * @swagger
 * /api/health/ping:
 *   get:
 *     summary: Controleert of de server actief is
 *     description: |
 *       Deze route geeft altijd een response terug met een waarde van `pong: true` 
 *       om te bevestigen dat de server actief is.
 *     tags:
 *       - Health
 *     responses:
 *       400:
 *         description: body meesturen of query parameters meegeven mag niet.
 *       200:
 *         description: De server is actief en reageerd met pong = true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pong:
 *                   type: boolean
 *                   example: true
 */

const ping = async (ctx: KoaContext<Pong>) => {
  ctx.status = 200;
  ctx.body = healthService.ping();
};
ping.validationScheme = null;
/**
 * @swagger
 * /api/health/details:
 *   get:
 *     summary: Haal systeemdetails op
 *     description: Geeft details van het systeem terug, zoals de omgeving, versie, naam en beschrijving.
 *     tags:
 *       - Health
 *     responses:
 *       400:
 *         description: body meesturen of query parameters meegeven mag niet.
 *       200:
 *         description: Systeemdetails
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 env:
 *                   type: string
 *                   description: De huidige omgeving waarin de server draait (bijv. productie, ontwikkeling)
 *                   example: "production"
 *                 version:
 *                   type: string
 *                   description: De huidige versie van de applicatie
 *                   example: "1.0.0"
 *                 name:
 *                   type: string
 *                   description: De naam van de applicatie
 *                   example: "Mijn Applicatie"
 *                 description:
 *                   type: string
 *                   description: Beschrijving van het systeem
 *                   example: "Een systeem voor het beheren van boeken en gebruikers"
 */

const getDetails = async (ctx: KoaContext<Details>) => {
  ctx.status = 200;
  ctx.body = healthService.getDetails();
};
getDetails.validationScheme = null;
export default (parent: KoaRouter) => {
  const router = new Router<BibliotheekAppState, BibliotheekAppContext>({ prefix: '/health' });

  router.get('/ping',validate(ping.validationScheme), ping);
  router.get('/details',validate(getDetails.validationScheme), getDetails);

  parent.use(router.routes()).use(router.allowedMethods());
};
