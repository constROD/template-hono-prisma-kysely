import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';
import {
  createUserSchema,
  updateUserSchema,
  userSchema,
  type CreateUser,
  type UpdateUser,
  type User,
} from './schema';

describe('userSchema', () => {
  it('should validate User schema', () => {
    const input: User = {
      id: faker.string.uuid(),
      email: faker.internet.email(),
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null,
    };

    const result = userSchema.safeParse(input);

    expect(result.success).toBe(true);
  });
});

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

describe('updateUser', () => {
  it('should validate updateUser input', () => {
    const input: UpdateUser = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
    };

    const result = updateUserSchema.safeParse(input);

    expect(result.success).toBe(true);
  });
});
