import type { Session } from '@/types/auth';
import type { OpenAPIHono } from '@hono/zod-openapi';
import { vi } from 'vitest';

let capturedHandler: (c: typeof mockHonoContext) => Promise<unknown>;
const mocks = vi.hoisted(() => ({
  OpenAPIHono: {
    openapi: vi.fn((_, handler) => {
      capturedHandler = handler;
    }),
    use: vi.fn(),
    doc: vi.fn(),
    onError: vi.fn(),
    get: vi.fn(),
    openAPIRegistry: { registerComponent: vi.fn() },
  },
}));

vi.mock('@hono/zod-openapi', async () => {
  const actual = await vi.importActual('@hono/zod-openapi');
  return {
    ...actual,
    OpenAPIHono: vi.fn().mockReturnValue(mocks.OpenAPIHono),
  };
});

export const mockHonoContext = {
  get: vi.fn(),
  set: vi.fn(),
  json: vi.fn(),
  req: {
    valid: vi.fn(),
    param: vi.fn().mockReturnValue({}),
    query: vi.fn().mockReturnValue({}),
    header: vi.fn().mockReturnValue({}),
    json: vi.fn().mockResolvedValue({}),
  },
};

export const mockOpenAPIHono = mocks.OpenAPIHono as unknown as OpenAPIHono;
export const mockHonoHandler = (c: typeof mockHonoContext) => capturedHandler(c);
export const mockSession = { id: crypto.randomUUID(), email: 'user123@example.com' } as Session;
