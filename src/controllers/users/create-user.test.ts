import { UserRoleType } from '@/db/types';
import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';
import { createUserBodySchema, type CreateUserBody } from './create-user';

describe('createUserBody', () => {
  it('should validate createUserBody input', () => {
    const input: CreateUserBody = {
      email: faker.internet.email(),
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      role: UserRoleType.USER,
    };

    const result = createUserBodySchema.safeParse(input);

    expect(result.success).toBe(true);
  });
});
