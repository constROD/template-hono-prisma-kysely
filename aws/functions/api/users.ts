import { handle } from 'hono/aws-lambda';
import usersRoutes from 'src/controllers/users/routes';

export const handler = handle(usersRoutes);
