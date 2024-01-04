import { body } from 'express-validator';

export const createNewWidgetTypeValidator = () => {
  return [body('name').trim().notEmpty().withMessage('Name cannot be empty')];
};
