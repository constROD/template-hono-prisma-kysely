import { mockDbClient } from '@/db/__test-utils__/mock-db-client';
import { type Context } from 'hono';
import { describe, expect, it, vi } from 'vitest';
import { mockHonoContext } from './__test-utils__/openapi-hono';
import { setUpDbClientMiddleware } from './set-up-db-client';

describe('setUpDbClientMiddleware', () => {
  it('should set up the dbClient in the context and call next', async () => {
    const mockNext = vi.fn();

    await setUpDbClientMiddleware(mockHonoContext as unknown as Context, mockNext);

    expect(mockHonoContext.set).toHaveBeenCalledWith('dbClient', mockDbClient.dbClient);
    expect(mockNext).toHaveBeenCalled();
  });
});
