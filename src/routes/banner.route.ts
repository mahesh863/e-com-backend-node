import { Router as expressRouter } from 'express';
import { getBannerDetailsById } from '../controller/banner.controller';

const router = expressRouter();

router.route('/banner/details').get(getBannerDetailsById);

export default router;
