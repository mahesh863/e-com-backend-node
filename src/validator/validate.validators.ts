import { Response, Request, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import CustomError from '../utils/customErrors';

const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    next();
    return;
  }
  const extractedErrors: string = errors.array()[0].msg;

  return next(new CustomError(extractedErrors, 400));
};

export default validate;
