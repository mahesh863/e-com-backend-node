import { Request, Response, NextFunction } from 'express';

import GenericBody from '../interface/GenericBody';
import { getUserById } from '../dal/user.dal';

const roleHandler = (role: number[]) => async (req: Request, res: Response, next: NextFunction) => {
  const { user } = req.body as GenericBody;

  const userData = await getUserById(user.id);

  if (role.includes(userData.role)) {
    next();
  } else {
    return res.status(403).json({
      error: 'Restricted access',
    });
  }
};

export default roleHandler;
