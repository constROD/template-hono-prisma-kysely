import { getUserData } from '@/data/users/get-user';
import type { DbClient } from '@/db/create-db-client';
import { UserRoleType } from '@/db/types';
import type { Session } from '@/types/auth';

export type AuthorizationServiceDependencies = {
  getUserData: typeof getUserData;
};

export type AuthorizationServiceArgs = {
  dbClient: DbClient;
  payload: { session: Session };
  dependencies?: AuthorizationServiceDependencies;
};

export async function authorizationService({
  dbClient,
  payload,
  dependencies = {
    getUserData,
  },
}: AuthorizationServiceArgs) {
  const user = await dependencies.getUserData({ dbClient, id: payload.session.id });

  const isSuperAdmin = user.role === UserRoleType.SUPER_ADMIN;
  const isAdmin = user.role === UserRoleType.ADMIN;
  const isUser = user.role === UserRoleType.USER;

  return {
    user,
    userAsserts: { isSuperAdmin, isAdmin, isUser },
  };
}
