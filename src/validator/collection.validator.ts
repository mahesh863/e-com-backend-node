import { body, query } from 'express-validator';

export const createNewCollectionValidator = () => {
  return [
    body('name').trim().notEmpty().withMessage('Collection name cannot be empty'),
    body('productIds').notEmpty().withMessage('Products cannot be empty'),
  ];
};

export const getCollectionDetailsValidator = () => {
  return [query('collectionId').trim().notEmpty().withMessage('Collection id is required')];
};
