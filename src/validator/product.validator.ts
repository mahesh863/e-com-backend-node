import { body, query } from 'express-validator';

export const createNewProductValidator = () => {
  return [
    body('name').trim().notEmpty().withMessage('Product name cannot be empty'),
    body('description').trim().notEmpty().withMessage('Product description cannot be empty'),
    body('stock').trim().notEmpty().withMessage('Stock cannot be empty').isInt({ gt: 0 }).withMessage('Stock must be a number and greater than 0'),
    body('price').trim().notEmpty().withMessage('Price cannot be empty').isFloat({ gt: 0 }).withMessage('Price must be a number and greater than 0'),
  ];
};

export const updateProductValidator = () => {
  return [body('id').trim().notEmpty().withMessage('Product id cannot be empty')];
};

export const deleteProductValidator = () => {
  return [query('id').trim().notEmpty().withMessage('Product id cannot be empty')];
};

export const productVisibilityValidator = () => {
  return [
    body('productIds').trim().notEmpty().withMessage('Product id cannot be empty'),
    body('visibility').trim().notEmpty().withMessage('Visibility cannot be empty').isBoolean().withMessage('Visibility must be a boolean value'),
  ];
};
