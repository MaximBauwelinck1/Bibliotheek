import Router from '@koa/router';
import Joi from 'joi';
import validate from '../core/validation';
import * as gebruikerService from '../service/gebruikers';
import type {
  KoaContext,
  KoaRouter,
  BibliotheekAppState,
  BibliotheekAppContext,
} from '../types/koa';
import type { LoginResponse, LoginRequest } from '../types/gebruiker';

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

  router.post('/', validate(login.validationScheme), login);

  parent.use(router.routes()).use(router.allowedMethods());
}
