import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';
import { updateUserBodySchema, type UpdateUserBody } from './update-user';

describe('updateUserBody', () => {
  it('should validate updateUserBody input', () => {
    const input: UpdateUserBody = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
    };

    const result = updateUserBodySchema.safeParse(input);

    expect(result.success).toBe(true);
  });
});
