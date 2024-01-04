import { body, query } from 'express-validator';

export const createNewCategoryValidator = () => {
  return [body('name').trim().notEmpty().withMessage('Category name cannot be empty')];
};

export const updateCategoryValidator = () => {
  return [body('id').trim().notEmpty().withMessage('Category id cannot be empty')];
};

export const deleteCategoryValidator = () => {
  return [query('id').trim().notEmpty().withMessage('Category id cannot be empty')];
};

export const categoryVisibilityValidator = () => {
  return [
    body('categoryIds').trim().notEmpty().withMessage('Category id cannot be empty'),
    body('visibility').trim().notEmpty().withMessage('Visibility cannot be empty').isBoolean().withMessage('Visibility must be a boolean value'),
  ];
};
