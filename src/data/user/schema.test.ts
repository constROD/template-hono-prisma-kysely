import { UserRoleType } from '@/db/types';
import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';
import { userSchema, type User } from './schema';

describe('userSchema', () => {
  it('should validate userSchema', () => {
    const input: User = {
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
      id: faker.string.uuid(),
      email: faker.internet.email(),
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      role: UserRoleType.USER,
    };

    const result = userSchema.safeParse(input);

    expect(result.success).toBe(true);
  });
});
