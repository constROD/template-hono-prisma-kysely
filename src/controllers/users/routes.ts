import { OpenAPIHono } from '@hono/zod-openapi';
import { makeArchiveUserRouteHandler } from './archive-user';
import { makeCreateUserRouteHandler } from './create-user';
import { makeDeleteUserRouteHandler } from './delete-user';
import { makeGetUserRouteHandler } from './get-user';
import { makeGetUsersRouteHandler } from './get-users';
import { makeSearchUsersRouteHandler } from './search-users';
import { makeUpdateUserRouteHandler } from './update-user';

const app = new OpenAPIHono();

makeGetUsersRouteHandler(app);
makeSearchUsersRouteHandler(app);
makeGetUserRouteHandler(app);
makeCreateUserRouteHandler(app);
makeUpdateUserRouteHandler(app);
makeDeleteUserRouteHandler(app);
makeArchiveUserRouteHandler(app);

export default app;
