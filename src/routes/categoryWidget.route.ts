import { Router as expressRouter } from 'express';
import { getAllCategoryWidgetDataById } from '../controller/categoryWidget.controller';

const router = expressRouter();

router.route('/category/widget').get(getAllCategoryWidgetDataById);

export default router;
