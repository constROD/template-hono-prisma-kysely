import { type Tables } from '@/db/schema';
import { UserRoleType } from '@/db/types';
import { faker } from '@faker-js/faker';
import { type User } from '../user/schema';

export function makeFakeUser(params: Partial<Tables['users']> = {}) {
  return {
    id: params?.id ?? faker.string.uuid(),
    created_at: params?.created_at ?? faker.date.recent(),
    updated_at: params?.updated_at ?? faker.date.recent(),
    deleted_at: params?.deleted_at ?? null,
    first_name: params?.first_name ?? faker.person.firstName(),
    last_name: params?.last_name ?? faker.person.lastName(),
    email: params?.email?.toLowerCase() ?? faker.internet.email().toLowerCase(),
    role: params?.role ?? UserRoleType.USER,
  } satisfies User;
}
