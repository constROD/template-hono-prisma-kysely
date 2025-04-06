import { type DbClient } from '@/db/create-db-client';
import { type UserRoleType } from '@/db/types';
import { BadRequestError, NotFoundError } from '@/utils/errors';
import { sql } from 'kysely';
import { type UpdateFeatureFlag } from './schema';

export type UpdateFeatureFlagDataArgs = {
  dbClient: DbClient;
  role: UserRoleType;
  values: UpdateFeatureFlag;
};

export async function updateFeatureFlagData({ dbClient, role, values }: UpdateFeatureFlagDataArgs) {
  if (!values.json) throw new BadRequestError('Feature flag JSON is required.');

  const updatedRecord = await dbClient
    .updateTable('feature_flags')
    .set({ ...values, json: JSON.stringify(values), updated_at: sql`NOW()` })
    .where('role', '=', role)
    .returningAll()
    .executeTakeFirstOrThrow(() => new NotFoundError('Feature flag not found.'));

  return updatedRecord;
}

export type UpdateFeatureFlagDataResponse = Awaited<ReturnType<typeof updateFeatureFlagData>>;
