import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AnyZodObject } from "zod/v3";

export const validateResource = (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // parse the incoming request against the schema
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      })
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.issues.map(e => (
            {
              path: e.path.join('.'),
              message: e.message
            }
          ))
        })
      }
      next(error);
    }
  };