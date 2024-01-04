import { Router as expressRouter } from 'express';
import { getAllPublicCategory } from '../controller/category.controller';

const router = expressRouter();

router.route('/category').get(getAllPublicCategory);

export default router;
