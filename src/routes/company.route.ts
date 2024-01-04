import { Router as expressRouter } from 'express';
import { getAllPublicCompany } from '../controller/company.controller';

const router = expressRouter();

router.route('/company').get(getAllPublicCompany);

export default router;
