import { createDbClient } from '@/db/create-db-client';
import type { HonoEnv } from '@/types/hono';
import type { Context, Next } from 'hono';

export async function setUpDbClientMiddleware(c: Context<HonoEnv>, next: Next) {
  const dbClient = createDbClient();
  c.set('dbClient', dbClient);
  await next();
}
