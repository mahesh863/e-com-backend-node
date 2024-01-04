import { body } from 'express-validator';

export const createNewWidgetValidator = () => {
  return [
    body('type').trim().notEmpty().withMessage('Widget type cannot be empty'),
    body('widgetData').notEmpty().withMessage('Widget data cannot be empty'),
    body('name').notEmpty().withMessage('Widget name cannot be empty'),
  ];
};
