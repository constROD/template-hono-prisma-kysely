import { handle } from 'hono/aws-lambda';
import productsRoutes from 'src/controllers/products/routes';

export const handler = handle(productsRoutes);
