import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';
import { updateUserSchema, type UpdateUser } from './update-user';

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
