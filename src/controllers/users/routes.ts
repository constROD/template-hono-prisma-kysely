import { type HonoEnv } from '@/types/hono';
import { OpenAPIHono } from '@hono/zod-openapi';
import { archiveUserRoute, archiveUserRouteHandler } from './archive-user';
import { createUserRoute, createUserRouteHandler } from './create-user';
import { deleteUserRoute, deleteUserRouteHandler } from './delete-user';
import { getUserRoute, getUserRouteHandler } from './get-user';
import { getUsersRoute, getUsersRouteHandler } from './get-users';
import { searchUsersRoute, searchUsersRouteHandler } from './search-users';
import { updateUserRoute, updateUserRouteHandler } from './update-user';

const usersRoutes = new OpenAPIHono<HonoEnv>()
  .openapi(searchUsersRoute, searchUsersRouteHandler)
  .openapi(getUsersRoute, getUsersRouteHandler)
  .openapi(createUserRoute, createUserRouteHandler)
  .openapi(getUserRoute, getUserRouteHandler)
  .openapi(updateUserRoute, updateUserRouteHandler)
  .openapi(deleteUserRoute, deleteUserRouteHandler)
  .openapi(archiveUserRoute, archiveUserRouteHandler);

export default usersRoutes;
