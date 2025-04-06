import { getFeatureFlagData } from '@/data/feature-flags/get-feature-flag';
import { getUserData } from '@/data/users/get-user';
import { type DbClient } from '@/db/create-db-client';
import { type Session } from '@/types/auth';

export type GetFeatureFlagServiceDependencies = {
  getUserData: typeof getUserData;
  getFeatureFlagData: typeof getFeatureFlagData;
};

export type GetFeatureFlagServiceArgs = {
  dbClient: DbClient;
  payload: { session: Session };
  dependencies?: GetFeatureFlagServiceDependencies;
};

export async function getFeatureFlagService({
  dbClient,
  payload,
  dependencies = {
    getUserData,
    getFeatureFlagData,
  },
}: GetFeatureFlagServiceArgs) {
  const userData = await dependencies.getUserData({
    dbClient,
    id: payload.session.accountId,
  });

  const featureFlagData = await dependencies.getFeatureFlagData({
    dbClient,
    role: userData.role,
  });

  return featureFlagData;
}

export type GetFeatureFlagServiceResponse = Awaited<ReturnType<typeof getFeatureFlagService>>;
