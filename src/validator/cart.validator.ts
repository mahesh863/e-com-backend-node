import { body, query } from 'express-validator';

export const addToCartValidator = () => {
  return [
    body('userId').trim().notEmpty().withMessage('User cannot cannot be empty'),
    body('productId').trim().notEmpty().withMessage('Products cannot cannot be empty'),
    body('totalQuantity').trim().notEmpty().withMessage('Quantity cannot cannot be empty'),
  ];
};

export const updateCartValidator = () => {
  return [
    body('id').trim().notEmpty().withMessage('Cart id cannot cannot be empty'),
    body('totalQuantity').trim().notEmpty().withMessage('Quantity cannot cannot be empty'),
  ];
};

export const deleteFromCartValidator = () => {
  return [query('cartId').trim().notEmpty().withMessage('Cart id cannot cannot be empty')];
};

export const getUserCartValidator = () => {
  return [query('userId').trim().notEmpty().withMessage('User id cannot cannot be empty')];
};
