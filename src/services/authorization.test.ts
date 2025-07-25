import { mockDbClient } from '@/db/__test-utils__/mock-db-client';
import { UserRoleType } from '@/db/types';
import type { Session } from '@/types/auth';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { authorizationService } from './authorization';

const { dbClient } = mockDbClient;

const mockDependencies = {
  getUserData: vi.fn(),
};

const mockUser = {
  id: 'user123',
  email: 'test@example.com',
  role: UserRoleType.USER,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const mockSession: Session = {
  id: 'user123',
  email: 'test@example.com',
};

describe('authorizationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return user data with correct role assertions for SUPER_ADMIN', async () => {
    mockDependencies.getUserData.mockResolvedValue({
      ...mockUser,
      role: UserRoleType.SUPER_ADMIN,
    });

    const result = await authorizationService({
      dbClient,
      payload: { session: mockSession },
      dependencies: mockDependencies,
    });

    expect(mockDependencies.getUserData).toHaveBeenCalledWith({
      dbClient,
      id: 'user123',
    });
    expect(result.user).toEqual({
      ...mockUser,
      role: UserRoleType.SUPER_ADMIN,
    });
    expect(result.userAsserts.isSuperAdmin).toBe(true);
    expect(result.userAsserts.isAdmin).toBe(false);
    expect(result.userAsserts.isUser).toBe(false);
  });

  it('should return user data with correct role assertions for ADMIN', async () => {
    mockDependencies.getUserData.mockResolvedValue({
      ...mockUser,
      role: UserRoleType.ADMIN,
    });

    const result = await authorizationService({
      dbClient,
      payload: { session: mockSession },
      dependencies: mockDependencies,
    });

    expect(result.userAsserts.isSuperAdmin).toBe(false);
    expect(result.userAsserts.isAdmin).toBe(true);
    expect(result.userAsserts.isUser).toBe(false);
  });

  it('should return user data with correct role assertions for USER', async () => {
    mockDependencies.getUserData.mockResolvedValue(mockUser);

    const result = await authorizationService({
      dbClient,
      payload: { session: mockSession },
      dependencies: mockDependencies,
    });

    expect(result.userAsserts.isSuperAdmin).toBe(false);
    expect(result.userAsserts.isAdmin).toBe(false);
    expect(result.userAsserts.isUser).toBe(true);
  });
});
