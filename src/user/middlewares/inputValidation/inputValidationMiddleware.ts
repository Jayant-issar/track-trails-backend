import { Context, Next } from 'hono';
import { ZodSchema, ZodError } from 'zod';

interface ValidationError {
  path: string[];
  message: string;
}

interface ErrorResponse {
  success: false;
  message: string;
  errors?: ValidationError[];
  code: string;
}

const formatErrorPath = (path: (string | number)[]): string[] => {
  return path.map(element => String(element));
};

export const validateRequest = (schema: ZodSchema, validateQuery: boolean = false) => {
  return async (c: Context, next: Next) => {
    try {
      const method = c.req.method;
      
      if (['POST', 'PUT', 'PATCH'].includes(method)) {
        const contentType = c.req.header('Content-Type');
        if (!contentType || !contentType.includes('application/json')) {
          const error: ErrorResponse = {
            success: false,
            message: 'Invalid Content-Type. Expected application/json',
            code: 'INVALID_CONTENT_TYPE'
          };
          return c.json(error, 415);
        }
      }

      const contentLength = parseInt(c.req.header('Content-Length') || '0');
      if (contentLength > 10 * 1024 * 1024) {
        const error: ErrorResponse = {
          success: false,
          message: 'Request body too large',
          code: 'REQUEST_TOO_LARGE'
        };
        return c.json(error, 413);
      }

      try {
        let validationTarget: unknown;
        
        if (['POST', 'PUT', 'PATCH'].includes(method)) {
          try {
            validationTarget = await c.req.json();
          } catch (parseError) {
            const error: ErrorResponse = {
              success: false,
              message: 'Invalid JSON format',
              code: 'INVALID_JSON'
            };
            return c.json(error, 400);
          }

          if (!validationTarget || (typeof validationTarget === 'object' && Object.keys(validationTarget as object).length === 0)) {
            const error: ErrorResponse = {
              success: false,
              message: 'Request body is required',
              code: 'EMPTY_REQUEST_BODY'
            };
            return c.json(error, 400);
          }
        } else if (validateQuery) {
          validationTarget = c.req.query();
        }

        const validatedData = await schema.parseAsync(validationTarget);
        c.set('validatedData', validatedData);

      } catch (e) {
        if (e instanceof ZodError) {
          const error: ErrorResponse = {
            success: false,
            message: 'Validation failed',
            errors: e.errors.map(err => ({
              path: formatErrorPath(err.path),
              message: err.message
            })),
            code: 'VALIDATION_ERROR'
          };
          return c.json(error, 400);
        }

        throw e;
      }

      // Call next() and await its result
      const response = await next();
      return response;

    } catch (error) {
      console.error('Unexpected validation error:', error);
      
      const errorResponse: ErrorResponse = {
        success: false,
        message: 'Internal server error during validation',
        code: 'INTERNAL_SERVER_ERROR'
      };
      
      return c.json(errorResponse, 500);
    }
  };
};