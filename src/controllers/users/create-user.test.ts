import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';
import { createUserSchema, type CreateUser } from './create-user';

describe('createUser', () => {
  it('should validate createUser input', () => {
    const input: CreateUser = {
      email: faker.internet.email(),
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
    };

    const result = createUserSchema.safeParse(input);

    expect(result.success).toBe(true);
  });
});
