import { body, query } from 'express-validator';

const createNewAdminValidator = () => {
  return [
    body('name').trim().notEmpty().withMessage('Name cannot be empty'),
    body('role').trim().notEmpty().withMessage('Role is required'),
    body('email').trim().notEmpty().withMessage('Email cannot be empty').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({ min: 4, max: 20 }).withMessage('Password must be between 4 and 20 characters'),
  ];
};

const updateAdminValidator = () => {
  return [body('id').trim().notEmpty().withMessage('User id is required')];
};

const deleteAdminValidator = () => {
  return [query('id').trim().notEmpty().withMessage('User id is required')];
};

export { createNewAdminValidator, updateAdminValidator, deleteAdminValidator };
