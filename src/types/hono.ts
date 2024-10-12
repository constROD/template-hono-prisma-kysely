import { type DbClient } from '@/db/create-db-client';
import { type AuthenticatedUser, type Session } from './auth';

declare module 'hono' {
  interface ContextVariableMap {
    session: Session | null;
    authenticatedUser: AuthenticatedUser | null;
    dbClient: DbClient;
  }
}
