import { type DbClient } from '@/db/create-db-client';
import { type UserRoleType } from '@/db/types';
import { NotFoundError } from '@/utils/errors';

export type GetFeatureFlagDataArgs = {
  dbClient: DbClient;
  role: UserRoleType;
};

export async function getFeatureFlagData({ dbClient, role }: GetFeatureFlagDataArgs) {
  const record = await dbClient
    .selectFrom('feature_flags')
    .where('role', '=', role)
    .selectAll()
    .executeTakeFirstOrThrow(() => new NotFoundError('Feature flag not found.'));
  return record;
}

export type GetFeatureFlagDataResponse = Awaited<ReturnType<typeof getFeatureFlagData>>;
