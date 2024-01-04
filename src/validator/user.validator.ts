import { body, query } from 'express-validator';

const signUpValidator = () => {
  return [
    body('name').trim().notEmpty().withMessage('Name cannot be empty'),

    body('email').trim().notEmpty().withMessage('Email cannot be empty').isEmail().withMessage('Email must be valid'),

    body('password').trim().isLength({ min: 4, max: 20 }).withMessage('Password must be between 4 and 20 characters'),
  ];
};

const signInValidator = () => {
  return [
    body('email').trim().notEmpty().withMessage('Email cannot be empty').isEmail().withMessage('Email must be valid'),

    body('password').trim().notEmpty().withMessage('Password cannot be empty'),
  ];
};

const passwordResetValidator = () => {
  return [
    body('token').trim().notEmpty().withMessage('Password reset token cannot be empty'),
    body('password').trim().isLength({ min: 4, max: 20 }).withMessage('Password must be between 4 and 20 characters'),
  ];
};

const forgotPasswordValidator = () => {
  return [query('email').trim().notEmpty().withMessage('Email cannot be empty').isEmail().withMessage('Email must be valid')];
};

export { signUpValidator, signInValidator, passwordResetValidator, forgotPasswordValidator };
