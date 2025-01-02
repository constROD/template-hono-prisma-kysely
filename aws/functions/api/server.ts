import { handle } from 'hono/aws-lambda';
import serverRoutes from 'src/controllers/server/routes';

export const handler = handle(serverRoutes);
