import { makeFakeUser } from '@/data/users/__test-utils__/make-fake-user';
import { mockDbClient } from '@/db/__test-utils__/mock-db-client';
import { UserRoleType } from '@/db/types';
import { mockSession } from '@/middlewares/__test-utils__/mock-openapi-hono';
import { NotFoundError } from '@/utils/errors';
import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getFeatureFlagService } from './get-feature-flag';

const mockDependencies = {
  getUserData: vi.fn(),
  getFeatureFlagData: vi.fn(),
};

const mockUser = makeFakeUser({
  id: '123',
  email: 'test@example.com',
  role: UserRoleType.USER,
  first_name: 'Test',
  last_name: 'User',
});

const mockFeatureFlag = {
  id: faker.string.uuid(),
  role: UserRoleType.USER,
  json: { feature1: true, feature2: false },
};

describe('getFeatureFlagService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully get feature flags for user', async () => {
    const payload = {
      session: mockSession,
    };

    mockDependencies.getUserData.mockResolvedValue(mockUser);
    mockDependencies.getFeatureFlagData.mockResolvedValue(mockFeatureFlag);

    const result = await getFeatureFlagService({
      dbClient: mockDbClient.dbClient,
      payload,
      dependencies: mockDependencies,
    });

    expect(mockDependencies.getUserData).toHaveBeenCalledWith({
      dbClient: mockDbClient.dbClient,
      id: payload.session.accountId,
    });

    expect(mockDependencies.getFeatureFlagData).toHaveBeenCalledWith({
      dbClient: mockDbClient.dbClient,
      role: mockUser.role,
    });

    expect(result).toEqual(mockFeatureFlag);
  });

  it('should throw NotFoundError when user is not found', async () => {
    const payload = {
      session: mockSession,
    };

    mockDependencies.getUserData.mockRejectedValue(new NotFoundError('User not found.'));

    await expect(
      getFeatureFlagService({
        dbClient: mockDbClient.dbClient,
        payload,
        dependencies: mockDependencies,
      })
    ).rejects.toThrow(new NotFoundError('User not found.'));

    expect(mockDependencies.getUserData).toHaveBeenCalledWith({
      dbClient: mockDbClient.dbClient,
      id: payload.session.accountId,
    });

    expect(mockDependencies.getFeatureFlagData).not.toHaveBeenCalled();
  });

  it('should throw NotFoundError when feature flag is not found', async () => {
    const payload = {
      session: mockSession,
    };

    mockDependencies.getUserData.mockResolvedValue(mockUser);
    mockDependencies.getFeatureFlagData.mockRejectedValue(
      new NotFoundError('Feature flag not found.')
    );

    await expect(
      getFeatureFlagService({
        dbClient: mockDbClient.dbClient,
        payload,
        dependencies: mockDependencies,
      })
    ).rejects.toThrow(new NotFoundError('Feature flag not found.'));

    expect(mockDependencies.getUserData).toHaveBeenCalledWith({
      dbClient: mockDbClient.dbClient,
      id: payload.session.accountId,
    });

    expect(mockDependencies.getFeatureFlagData).toHaveBeenCalledWith({
      dbClient: mockDbClient.dbClient,
      role: mockUser.role,
    });
  });
});
