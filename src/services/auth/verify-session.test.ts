import { mockDbClient } from '@/db/__test-utils__/mock-db-client';
import { BadRequestError } from '@/utils/errors';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { verifySessionAuthService } from './verify-session';

const mockDependencies = {
  getSessionData: vi.fn(),
  revokeSessionData: vi.fn(),
  updateSessionData: vi.fn(),
  generateAccessToken: vi.fn(),
  generateRefreshToken: vi.fn(),
  verifyAccessToken: vi.fn(),
  verifyRefreshToken: vi.fn(),
};

const mockAccessTokenPayload = {
  sessionId: 'session123',
  accountId: 'account123',
  email: 'test@example.com',
};

const mockSession = {
  id: 'session123',
  refresh_token: 'refreshToken123',
  account_id: 'account123',
};

describe('verifySessionService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully verify and refresh tokens', async () => {
    const payload = {
      accessToken: 'validAccessToken',
    };

    mockDependencies.verifyAccessToken.mockReturnValue(mockAccessTokenPayload);
    mockDependencies.getSessionData.mockResolvedValue(mockSession);
    mockDependencies.verifyRefreshToken.mockReturnValue({ accountId: 'account123' });
    mockDependencies.generateRefreshToken.mockReturnValue('newRefreshToken');
    mockDependencies.updateSessionData.mockResolvedValue({
      ...mockSession,
      refresh_token: 'newRefreshToken',
    });
    mockDependencies.generateAccessToken.mockReturnValue('newAccessToken');

    const result = await verifySessionAuthService({
      dbClient: mockDbClient.dbClientTransaction,
      payload,
      dependencies: mockDependencies,
    });

    expect(result).toEqual({
      accessToken: 'newAccessToken',
      accountId: mockAccessTokenPayload.accountId,
      email: mockAccessTokenPayload.email,
    });

    expect(mockDependencies.verifyAccessToken).toHaveBeenCalledWith(payload.accessToken);
    expect(mockDependencies.getSessionData).toHaveBeenCalledWith({
      dbClient: mockDbClient.dbClientTrx,
      id: mockAccessTokenPayload.sessionId,
    });
    expect(mockDependencies.updateSessionData).toHaveBeenCalledWith({
      dbClient: mockDbClient.dbClientTrx,
      id: mockSession.id,
      values: { refresh_token: 'newRefreshToken' },
    });
  });

  it('should throw BadRequestError when access token is invalid', async () => {
    const payload = {
      accessToken: 'invalidAccessToken',
    };

    mockDependencies.verifyAccessToken.mockReturnValue(null);

    await expect(
      verifySessionAuthService({
        dbClient: mockDbClient.dbClientTransaction,
        payload,
        dependencies: mockDependencies,
      })
    ).rejects.toThrow(new BadRequestError('Invalid access token.'));
  });

  it('should throw BadRequestError when refresh token is invalid', async () => {
    const payload = {
      accessToken: 'validAccessToken',
    };

    mockDependencies.verifyAccessToken.mockReturnValue(mockAccessTokenPayload);
    mockDependencies.getSessionData.mockResolvedValue(mockSession);
    mockDependencies.verifyRefreshToken.mockReturnValue(null);

    await expect(
      verifySessionAuthService({
        dbClient: mockDbClient.dbClientTransaction,
        payload,
        dependencies: mockDependencies,
      })
    ).rejects.toThrow(new BadRequestError('Invalid refresh token.'));
  });

  it('should throw BadRequestError when refresh token accountId does not match access token', async () => {
    const payload = {
      accessToken: 'validAccessToken',
    };

    mockDependencies.verifyAccessToken.mockReturnValue(mockAccessTokenPayload);
    mockDependencies.getSessionData.mockResolvedValue(mockSession);
    mockDependencies.verifyRefreshToken.mockReturnValue({ accountId: 'differentAccount' });

    await expect(
      verifySessionAuthService({
        dbClient: mockDbClient.dbClientTransaction,
        payload,
        dependencies: mockDependencies,
      })
    ).rejects.toThrow(new BadRequestError('Refresh token does not match access token.'));
  });
});
