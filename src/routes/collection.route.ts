import { Router as expressRouter } from 'express';
import { getCollectionDetails } from '../controller/collection.controller';
import { getCollectionDetailsValidator } from '../validator/collection.validator';
import validate from '../validator/validate.validators';

const router = expressRouter();

router.route('/collection/details').get(getCollectionDetailsValidator(), validate, getCollectionDetails);

export default router;
