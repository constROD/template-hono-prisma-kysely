import { handle } from 'hono/aws-lambda';
import meRoutes from 'src/controllers/me/routes';

export const handler = handle(meRoutes);
