import { mockDbClient } from '@/db/__test-utils__/mock-db-client';
import { UserRoleType } from '@/db/types';
import { BadRequestError } from '@/utils/errors';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { registerAuthService } from './register';

const mockDependencies = {
  getAccountData: vi.fn(),
  createAccountData: vi.fn(),
  createUserData: vi.fn(),
  hashText: vi.fn(),
};

describe('registerAuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully register a new user', async () => {
    const payload = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      role: UserRoleType.USER,
    };
    const hashedPassword = 'hashedPassword123';
    const createdAccount = {
      id: 'user-123',
      email: payload.email,
    };

    mockDependencies.getAccountData.mockResolvedValue(null);
    mockDependencies.hashText.mockReturnValue(hashedPassword);
    mockDependencies.createAccountData.mockResolvedValue(createdAccount);
    mockDependencies.createUserData.mockResolvedValue({});

    await registerAuthService({
      dbClient: mockDbClient.dbClientTransaction,
      payload,
      dependencies: mockDependencies,
    });

    expect(mockDependencies.getAccountData).toHaveBeenCalledWith({
      dbClient: mockDbClient.dbClientTrx,
      email: payload.email,
    });

    expect(mockDependencies.hashText).toHaveBeenCalledWith({ text: payload.password });

    expect(mockDependencies.createAccountData).toHaveBeenCalledWith({
      dbClient: mockDbClient.dbClientTrx,
      values: {
        email: payload.email,
        password: hashedPassword,
      },
    });

    expect(mockDependencies.createUserData).toHaveBeenCalledWith({
      dbClient: mockDbClient.dbClientTrx,
      values: {
        id: createdAccount.id,
        email: createdAccount.email,
        first_name: payload.firstName,
        last_name: payload.lastName,
        role: payload.role ?? UserRoleType.USER,
      },
    });
  });

  it('should throw BadRequestError if account already exists', async () => {
    const payload = {
      email: 'existing@example.com',
      password: 'password123',
    };

    mockDependencies.getAccountData.mockResolvedValue({
      id: 'existing-user',
      email: payload.email,
    });

    await expect(
      registerAuthService({
        dbClient: mockDbClient.dbClientTransaction,
        payload,
        dependencies: mockDependencies,
      })
    ).rejects.toThrow(new BadRequestError('Account already exists.'));

    expect(mockDependencies.createAccountData).not.toHaveBeenCalled();
    expect(mockDependencies.createUserData).not.toHaveBeenCalled();
    expect(mockDependencies.hashText).not.toHaveBeenCalled();
  });

  it('should register user with default role when role is not provided', async () => {
    const payload = {
      email: 'test@example.com',
      password: 'password123',
    };
    const hashedPassword = 'hashedPassword123';
    const createdAccount = {
      id: 'user-123',
      email: payload.email,
    };

    mockDependencies.getAccountData.mockResolvedValue(null);
    mockDependencies.hashText.mockReturnValue(hashedPassword);
    mockDependencies.createAccountData.mockResolvedValue(createdAccount);
    mockDependencies.createUserData.mockResolvedValue({});

    await registerAuthService({
      dbClient: mockDbClient.dbClientTransaction,
      payload,
      dependencies: mockDependencies,
    });

    expect(mockDependencies.createUserData).toHaveBeenCalledWith({
      dbClient: mockDbClient.dbClientTrx,
      values: {
        id: createdAccount.id,
        email: createdAccount.email,
        first_name: null,
        last_name: null,
        role: UserRoleType.USER,
      },
    });
  });
});
