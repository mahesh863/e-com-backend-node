import { Router as expressRouter } from 'express';
import { getAllWidget, getWidgetData } from '../controller/widget.controller';

const router = expressRouter();

router.route('/widget').get(getAllWidget);
router.route('/widget/data').get(getWidgetData);

export default router;
