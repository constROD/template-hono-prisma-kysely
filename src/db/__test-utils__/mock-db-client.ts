import { type DbClient } from '@/db/create-db-client';
import { vi } from 'vitest';

const mocks = vi.hoisted(() => ({ createDbClient: {} as DbClient }));

vi.mock('@/db/create-db-client', () => ({
  createDbClient: vi.fn().mockReturnValue(mocks.createDbClient),
}));

export const mockDbClient = {
  dbClient: mocks.createDbClient,
  dbClientTransaction: {
    transaction: vi.fn().mockReturnValue({
      execute: vi.fn(callback => callback(mocks.createDbClient)),
    }),
  } as unknown as DbClient,
};
