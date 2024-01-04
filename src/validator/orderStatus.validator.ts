import { body } from 'express-validator';

export const createNewOrderStatusValidator = () => {
  return [body('name').trim().notEmpty().withMessage('Name cannot be empty')];
};
