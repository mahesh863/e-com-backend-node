import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import CustomError from '../utils/customErrors';

const authHandler = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.auth || req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    throw new CustomError('Unauthorized', 401);
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

  if (typeof decodedToken === 'string') {
    throw new CustomError('Invalid token', 500);
  }

  req.body.user = decodedToken;
  next();
};

export default authHandler;
