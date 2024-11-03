import { type DbClient } from '@/db/create-db-client';
import { type Session } from './auth';

declare module 'hono' {
  interface ContextVariableMap {
    session: Session | null;
    dbClient: DbClient;
  }
}
