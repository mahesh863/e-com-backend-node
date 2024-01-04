import { Router as expressRouter } from 'express';
import {
  getAllPublicProductByCategory,
  getAllPublicProductByCompany,
  getAllPublicProducts,
  searchProducts,
  getProductDetailsById,
} from '../controller/product.controller';

const router = expressRouter();

router.route('/product').get(getAllPublicProducts);
router.route('/product/company/:companyId').get(getAllPublicProductByCompany);
router.route('/product/:categoryId').get(getAllPublicProductByCategory);
router.route('/products/search').get(searchProducts);
router.route('/products/data').get(getProductDetailsById);

export default router;
