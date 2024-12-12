import Router from '@koa/router';
import Joi from 'joi';
import validate from '../core/validation';
import * as gebruikerService from '../service/gebruikers';
import { authDelay } from '../core/auth';
import type {
  KoaContext,
  KoaRouter,
  BibliotheekAppState,
  BibliotheekAppContext,
} from '../types/koa';
import type { LoginResponse, LoginRequest } from '../types/gebruiker';

/**
 * @swagger
 * tags:
 *   name: Sessions
 *   description: Session management
 */

/**
 * @swagger
 * /api/sessions:
 *   post:
 *     summary: proberen in te loggen
 *     tags:
 *      - Sessions
 *     requestBody:
 *       description: De credentials van de gebruiker die probeert in te loggen
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: A JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         $ref: '#/components/responses/400BadRequest'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 */
const login = async (ctx: KoaContext<LoginResponse, void, LoginRequest>) => {
  const { email, password } = ctx.request.body;
  const token = await gebruikerService.login(email, password); 

  ctx.status = 200;
  ctx.body = { token };
};

login.validationScheme = {
  body: {
    email: Joi.string().email(),
    password: Joi.string(),
  },
};

export default function installSessionRouter(parent: KoaRouter) {
  const router = new Router<BibliotheekAppState, BibliotheekAppContext>({
    prefix: '/sessions',
  });

  router.post('/',authDelay, validate(login.validationScheme), login);

  parent.use(router.routes()).use(router.allowedMethods());
}
