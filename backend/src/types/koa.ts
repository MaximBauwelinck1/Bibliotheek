import type { ParameterizedContext } from 'koa';
import type { SessionInfo } from './auth';
import type Application from 'koa';
import type Router from '@koa/router';

export interface BibliotheekAppState {
  session: SessionInfo;
}

export interface BibliotheekAppContext<
  Params = unknown,
  RequestBody = unknown,
  Query = unknown,
> {
  request: {
    body: RequestBody;
    query: Query;
  };
  params: Params;
}

export type KoaContext<
  ResponseBody = unknown,
  Params = unknown,
  RequestBody = unknown,
  Query = unknown,
> = ParameterizedContext<
  BibliotheekAppState,
  BibliotheekAppContext<Params, RequestBody, Query>,
  ResponseBody
>;

export interface KoaApplication
  extends Application<BibliotheekAppState, BibliotheekAppContext> {}

export interface KoaRouter extends Router<BibliotheekAppState, BibliotheekAppContext> {}
