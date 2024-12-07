import { getServerDateTimeData } from '@/data/server/get-server-date-time';
import { createRoute, type OpenAPIHono, z } from '@hono/zod-openapi';

export const getServerDateTimeSchema = {
  response: z.string(),
};

export type GetServerDateTimeResponse = z.infer<typeof getServerDateTimeSchema.response>;

export const getServerDateTimeRoute = createRoute({
  security: [{ bearerAuth: [] }],
  method: 'get',
  path: '/server/date-time',
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

export const makeGetServerDateTimeRouteHandler = (app: OpenAPIHono) => {
  return app.openapi(getServerDateTimeRoute, async c => {
    const dbClient = c.get('dbClient');

    const serverDateTime = await getServerDateTimeData({ dbClient });

    return c.json(serverDateTime, { status: 200 });
  });
};
