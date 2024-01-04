import { body, query } from 'express-validator';

export const createNewCategoryWidgetValidator = () => {
  return [
    body('name').trim().notEmpty().withMessage('Name cannot cannot be empty'),
    body('header').trim().notEmpty().withMessage('Header cannot cannot be empty'),
    body('subHeader').trim().notEmpty().withMessage('Sub header cannot cannot be empty'),
    body('cta').trim().notEmpty().withMessage('CTA cannot cannot be empty'),
    body('type').trim().notEmpty().withMessage('Type cannot cannot be empty'),
    body('redirect').trim().notEmpty().withMessage('Redirect cannot cannot be empty'),
  ];
};

export const updateCategoryWidgetValidator = () => {
  return [body('id').trim().notEmpty().withMessage('Id is required')];
};

export const deleteCategoryWidgetValidator = () => {
  return [query('id').notEmpty().withMessage('Id is required')];
};
