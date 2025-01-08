import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  makeError,
  NotFoundError,
  UnauthorizedError,
} from '@/utils/errors';
import { type Context } from 'hono';
import { StatusCodes } from 'http-status-codes';
import { describe, expect, it } from 'vitest';
import { mockHonoContext } from './__test-utils__/openapi-hono';
import { errorHandlerMiddleware } from './error-handler';

describe('errorHandlerMiddleware', () => {
  it.each([
    { ErrorClass: BadRequestError, expectedStatus: StatusCodes.BAD_REQUEST },
    { ErrorClass: UnauthorizedError, expectedStatus: StatusCodes.UNAUTHORIZED },
    { ErrorClass: ForbiddenError, expectedStatus: StatusCodes.FORBIDDEN },
    { ErrorClass: NotFoundError, expectedStatus: StatusCodes.NOT_FOUND },
    { ErrorClass: ConflictError, expectedStatus: StatusCodes.CONFLICT },
    { ErrorClass: Error, expectedStatus: StatusCodes.INTERNAL_SERVER_ERROR },
  ])(
    'should handle $ErrorClass.name and return correct status',
    async ({ ErrorClass, expectedStatus }) => {
      const errorMessage = `Test ${ErrorClass.name}`;
      const mockError = new ErrorClass(errorMessage);

      const mockErrorResponse = makeError(mockError);

      await errorHandlerMiddleware(mockError, mockHonoContext as unknown as Context);

      expect(mockErrorResponse.statusCode).toBe(expectedStatus);
      expect(mockErrorResponse.error.name).toBe(ErrorClass.name);

      expect(mockHonoContext.json).toHaveBeenCalledWith(
        expect.objectContaining({
          name: ErrorClass.name,
          message: errorMessage,
        }),
        {
          status: expectedStatus,
        }
      );
    }
  );
});
