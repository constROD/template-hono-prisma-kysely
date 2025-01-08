import { type DbClient } from '@/db/create-db-client';
import { type RouteConfig, type RouteHandler } from '@hono/zod-openapi';
import { type Session } from './auth';

export type HonoEnv = {
  Variables: {
    session: Session | null;
    dbClient: DbClient;
  };
};

export type AppRouteHandler<TRouteConfig extends RouteConfig> = RouteHandler<TRouteConfig, HonoEnv>;
