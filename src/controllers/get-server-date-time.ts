import { getServerDateTimeData } from '@/data/get-server-date-time';
import { createRoute, z } from '@hono/zod-openapi';
import { type Handler } from 'hono';

export const getServerDateTimeSchema = {
  response: z.string(),
};

export type GetServerDateTimeResponse = z.infer<typeof getServerDateTimeSchema.response>;

export const getServerDateTimeRoute = createRoute({
  security: [{ bearerAuth: [] }],
  method: 'get',
  path: '/server-date-time',
  tags: ['Server'],
  summary: 'Retrieve the server date time',
  description: 'Retrieve the server date time.',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getServerDateTimeSchema.response,
        },
      },
      description: 'Server date time retrieved successfully',
    },
  },
});

export const getServerDateTimeHandler: Handler = async c => {
  const dbClient = c.get('dbClient');

  const serverDateTime = await getServerDateTimeData({ dbClient });

  return c.json<GetServerDateTimeResponse>(serverDateTime, { status: 200 });
};
