import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validateRequest = (schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const dataToValidate = source === 'body' ? req.body : source === 'query' ? req.query : req.params;
      
      const validatedData = schema.parse(dataToValidate);
      
      // Replace the original data with validated data
      if (source === 'body') {
        req.body = validatedData;
      } else if (source === 'query') {
        req.query = validatedData as any;
      } else {
        req.params = validatedData as any;
      }
      
      return next();
    } catch (error: any) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors?.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        })) || error.message
      });
    }
  };
};