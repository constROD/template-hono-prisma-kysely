// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { type HonoEnv } from '@/types/hono';
import { OpenAPIHono } from '@hono/zod-openapi';
import { archiveUserRoute, archiveUserRouteHandler } from './archive-user';
import { createUserRoute, createUserRouteHandler } from './create-user';
import { deleteUserRoute, deleteUserRouteHandler } from './delete-user';
import { getUserRoute, getUserRouteHandler } from './get-user';
import { getUsersRoute, getUsersRouteHandler } from './get-users';
import { searchUsersRoute, searchUsersRouteHandler } from './search-users';
import { updateUserRoute, updateUserRouteHandler } from './update-user';

const router = new OpenAPIHono<HonoEnv>()
  .openapi(getUsersRoute, getUsersRouteHandler)
  .openapi(searchUsersRoute, searchUsersRouteHandler)
  .openapi(getUserRoute, getUserRouteHandler)
  .openapi(createUserRoute, createUserRouteHandler)
  .openapi(updateUserRoute, updateUserRouteHandler)
  .openapi(deleteUserRoute, deleteUserRouteHandler)
  .openapi(archiveUserRoute, archiveUserRouteHandler);

export default router;
