import type { DbClient } from '@/db/create-db-client';
import type { EnvConfig } from '@/env';
import type { RouteConfig, RouteHandler } from '@hono/zod-openapi';
import type { Session } from './auth';

export type HonoEnv = {
  Variables: {
    session: Session | null;
    dbClient: DbClient;
  };
  Bindings: EnvConfig;
};

export type AppRouteHandler<TRouteConfig extends RouteConfig> = RouteHandler<TRouteConfig, HonoEnv>;
