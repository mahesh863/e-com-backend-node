import { body, query } from 'express-validator';

export const createNewCompanyValidator = () => {
  return [body('name').trim().notEmpty().withMessage('Company name cannot be empty')];
};

export const updateCompanyValidator = () => {
  return [body('id').trim().notEmpty().withMessage('Company id cannot be empty')];
};

export const deleteCompanyValidator = () => {
  return [query('id').trim().notEmpty().withMessage('Company id cannot be empty')];
};

export const companyVisibilityValidator = () => {
  return [
    body('companyIds').trim().notEmpty().withMessage('Company id cannot be empty'),
    body('visibility').trim().notEmpty().withMessage('Visibility cannot be empty').isBoolean().withMessage('Visibility must be a boolean value'),
  ];
};
