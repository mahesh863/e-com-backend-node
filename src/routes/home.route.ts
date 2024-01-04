import { Router as expressRouter } from 'express';
import { getHomeWidget } from '../controller/home.controller';

const router = expressRouter();

router.route('/home').get(getHomeWidget);

export default router;
