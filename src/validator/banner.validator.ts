import { body } from 'express-validator';

export const createNewBannerValidator = () => {
  return [
    body('headline').trim().notEmpty().withMessage('Headline cannot be empty'),
    body('cta').trim().notEmpty().withMessage('Button CTA cannot be empty'),
    body('redirectType').trim().notEmpty().withMessage('Redirect type cannot be empty'),
    body('redirectDataId').trim().notEmpty().withMessage('Redirect data id cannot be empty'),
  ];
};
export const updateBannerValidator = () => {
  return [body('id').trim().notEmpty().withMessage('Banner id cannot be empty')];
};
