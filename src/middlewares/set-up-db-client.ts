import { createDbClient } from '@/db/create-db-client';
import { type Context, type Next } from 'hono';

const dbClient = createDbClient();

export async function setUpDbClientMiddleware(c: Context, next: Next) {
  c.set('dbClient', dbClient);
  await next();
}
