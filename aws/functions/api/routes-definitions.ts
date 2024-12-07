import { makeGetMyProfileRouteHandler } from '@/controllers/me/get-my-profile';
import { makeUpdateMyProfileRouteHandler } from '@/controllers/me/update-my-profile';
import { makeGetProductsRouteHandler } from '@/controllers/products/get-products';
import { makeGetServerDateTimeRouteHandler } from '@/controllers/server/get-server-date-time';
import { makeArchiveUserRouteHandler } from '@/controllers/users/archive-user';
import { makeCreateUserRouteHandler } from '@/controllers/users/create-user';
import { makeDeleteUserRouteHandler } from '@/controllers/users/delete-user';
import { makeGetUserRouteHandler } from '@/controllers/users/get-user';
import { makeGetUsersRouteHandler } from '@/controllers/users/get-users';
import { makeSearchUsersRouteHandler } from '@/controllers/users/search-users';
import { makeUpdateUserRouteHandler } from '@/controllers/users/update-user';
import { type OpenAPIHono } from '@hono/zod-openapi';

export function setupServerRoutes(app: OpenAPIHono) {
  makeGetServerDateTimeRouteHandler(app);
}

export function setupMeRoutes(app: OpenAPIHono) {
  makeGetMyProfileRouteHandler(app);
  makeUpdateMyProfileRouteHandler(app);
}

export function setupUsersRoutes(app: OpenAPIHono) {
  makeSearchUsersRouteHandler(app);
  makeCreateUserRouteHandler(app);
  makeGetUsersRouteHandler(app);
  makeGetUserRouteHandler(app);
  makeUpdateUserRouteHandler(app);
  makeDeleteUserRouteHandler(app);
  makeArchiveUserRouteHandler(app);
}

export function setupProductsRoutes(app: OpenAPIHono) {
  makeGetProductsRouteHandler(app);
}

export function setupAllRoutesDefinitions(app: OpenAPIHono) {
  setupServerRoutes(app);
  setupMeRoutes(app);
  setupUsersRoutes(app);
  setupProductsRoutes(app);
}
