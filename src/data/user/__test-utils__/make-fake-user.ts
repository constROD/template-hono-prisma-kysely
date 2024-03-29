import { type Tables } from '@/db/schema';
import { faker } from '@faker-js/faker';

export function makeFakeUser(params: Partial<Tables['users']> = {}) {
  return {
    id: params?.id ?? faker.string.uuid(),
    first_name: params?.first_name ?? faker.person.firstName(),
    last_name: params?.last_name ?? faker.person.lastName(),
    email: params?.email?.toLowerCase() ?? faker.internet.email().toLowerCase(),
    created_at: params?.created_at ?? faker.date.recent(),
    updated_at: params?.updated_at ?? faker.date.recent(),
    deleted_at: params?.deleted_at ?? null,
  };
}
