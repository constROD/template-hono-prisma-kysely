import { ZodError } from 'zod';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
    this.message = message;
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
    this.message = message;
  }
}

export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ForbiddenError';
    this.message = message;
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
    this.message = message;
  }
}

export function makeError<TError extends Error>(error: TError) {
  const defaultError = {
    name: error.name,
    message: error.message,
  };

  /* Custom Errors */
  if (error instanceof ValidationError) {
    return {
      statusCode: 400,
      error: defaultError,
    };
  }

  if (error instanceof UnauthorizedError) {
    return {
      statusCode: 403,
      error: defaultError,
    };
  }

  if (error instanceof ForbiddenError) {
    return {
      statusCode: 403,
      error: defaultError,
    };
  }

  if (error instanceof NotFoundError) {
    return {
      statusCode: 404,
      error: defaultError,
    };
  }

  /* Library Errors */
  if (error instanceof ZodError) {
    return {
      statusCode: 400,
      error: {
        name: error.name,
        message: error.message,
        issues: error.issues,
      },
    };
  }

  return {
    statusCode: 500,
    error: defaultError,
  };
}
