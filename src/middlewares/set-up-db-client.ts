import { createDbClient } from '@/db/create-db-client';
import type { HonoEnv } from '@/types/hono';
import type { Context, Next } from 'hono';

const dbClient = createDbClient();

export async function setUpDbClientMiddleware(c: Context<HonoEnv>, next: Next) {
  c.set('dbClient', dbClient);
  await next();
}
