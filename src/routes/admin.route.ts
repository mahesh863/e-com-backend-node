import { Router as expressRouter } from 'express';

import { createAdmin, deleteAdmin, getAllAdmin, updateAdmin } from '../controller/admin.controller';
import { createNewAdminValidator, deleteAdminValidator, updateAdminValidator } from '../validator/admin.validator';
import roleHandler from '../middleware/role.middleware';
import {
  companyVisibilityValidator,
  createNewCompanyValidator,
  deleteCompanyValidator,
  updateCompanyValidator,
} from '../validator/company.validator';
import { changeCompanyVisibility, createNewCompany, deleteCompany, getAllCompany, updateCompany } from '../controller/company.controller';
import validate from '../validator/validate.validators';
import { generalAdminAccess, superAdminAccess } from '../constants/accessContolList';
import { changeCategoryVisibility, createNewCategory, deleteCategory, getAllCategory, updateCategory } from '../controller/category.controller';
import {
  categoryVisibilityValidator,
  createNewCategoryValidator,
  deleteCategoryValidator,
  updateCategoryValidator,
} from '../validator/category.validator';
import {
  changeProductVisibility,
  createNewProduct,
  deleteProducts,
  getAllProducts,
  updateProducts,
  getPublicProductList,
  getProductDetailsForAdminById,
} from '../controller/product.controller';
import {
  createNewProductValidator,
  deleteProductValidator,
  productVisibilityValidator,
  updateProductValidator,
} from '../validator/product.validator';
import { getAllCartForAdmin } from '../controller/cart.controller';
import { createNewCollection, getAllCollection } from '../controller/collection.controller';
import { createNewCollectionValidator } from '../validator/collection.validator';
import { createNewBannerValidator, updateBannerValidator } from '../validator/banner.validator';
import { createNewBanner, getBannerListDetails, updateBanner } from '../controller/banner.controller';
import { createNewWidgetTypeValidator } from '../validator/widgetType.validator';
import { createNewWidgetType, getWidgetTypeList } from '../controller/widgetType.controller';
import { createNewWidget, getAllWidget } from '../controller/widget.controller';
import { createNewWidgetValidator } from '../validator/widget.validator';
import { adminHomeDetails, createHomeController } from '../controller/home.controller';
import {
  createNewCategoryWidgetValidator,
  deleteCategoryWidgetValidator,
  updateCategoryWidgetValidator,
} from '../validator/categoryWidget.validator';
import {
  CreateNewCategoryWidget,
  deleteCategoryWidget,
  getAllCategoryWidgetData,
  updateCategoryWidget,
} from '../controller/categoryWidget.controller';
import { createNewOrderStatusValidator } from '../validator/orderStatus.validator';
import { createNewOrderStatus } from '../controller/orderStatus.controller';

const router = expressRouter();

router
  .route('/user')
  .post(roleHandler(superAdminAccess), createNewAdminValidator(), validate, createAdmin)
  .put(roleHandler(superAdminAccess), updateAdminValidator(), validate, updateAdmin)
  .delete(roleHandler(superAdminAccess), deleteAdminValidator(), validate, deleteAdmin)
  .get(roleHandler(superAdminAccess), getAllAdmin);

// company
router
  .route('/company')
  .post(roleHandler(superAdminAccess), createNewCompanyValidator(), validate, createNewCompany)
  .put(roleHandler(superAdminAccess), updateCompanyValidator(), validate, updateCompany)
  .delete(roleHandler(superAdminAccess), deleteCompanyValidator(), validate, deleteCompany)
  .get(roleHandler(generalAdminAccess), getAllCompany);

router.route('/company/visibility').post(roleHandler(superAdminAccess), companyVisibilityValidator(), validate, changeCompanyVisibility);

// category
router
  .route('/category')
  .post(roleHandler(superAdminAccess), createNewCategoryValidator(), validate, createNewCategory)
  .put(roleHandler(superAdminAccess), updateCategoryValidator(), validate, updateCategory)
  .delete(roleHandler(superAdminAccess), deleteCategoryValidator(), validate, deleteCategory)
  .get(roleHandler(generalAdminAccess), getAllCategory);

router.route('/category/visibility').post(roleHandler(superAdminAccess), categoryVisibilityValidator(), validate, changeCategoryVisibility);

// products
router
  .route('/product')
  .post(roleHandler(superAdminAccess), createNewProductValidator(), validate, createNewProduct)
  .put(roleHandler(superAdminAccess), updateProductValidator(), validate, updateProducts)
  .delete(roleHandler(superAdminAccess), deleteProductValidator(), validate, deleteProducts)
  .get(roleHandler(generalAdminAccess), getAllProducts);

router.route('/product/visibility').post(roleHandler(superAdminAccess), productVisibilityValidator(), validate, changeProductVisibility);

router.route('/public/product/list').get(roleHandler(superAdminAccess), getPublicProductList);

router.route('/product/details').get(roleHandler(generalAdminAccess), getProductDetailsForAdminById);

// cart
router.route('/cart').get(roleHandler(generalAdminAccess), getAllCartForAdmin);

// collection
router
  .route('/collection')
  .post(roleHandler(superAdminAccess), createNewCollectionValidator(), validate, createNewCollection)
  .get(roleHandler(generalAdminAccess), getAllCollection);

// widgets type
router
  .route('/widget/type')
  .post(roleHandler(superAdminAccess), createNewWidgetTypeValidator(), validate, createNewWidgetType)
  .get(roleHandler(generalAdminAccess), getWidgetTypeList);

// widgets
router
  .route('/widget')
  .post(roleHandler(superAdminAccess), createNewWidgetValidator(), validate, createNewWidget)
  .get(roleHandler(generalAdminAccess), getAllWidget);

// home
router.route('/home').post(roleHandler(superAdminAccess), createHomeController).get(roleHandler(generalAdminAccess), adminHomeDetails);

// banner
router
  .route('/banner')
  .post(roleHandler(superAdminAccess), createNewBannerValidator(), validate, createNewBanner)
  .put(roleHandler(superAdminAccess), updateBannerValidator(), validate, updateBanner)
  .get(roleHandler(generalAdminAccess), getBannerListDetails);

// manage category widget
router
  .route('/category/widget')
  .post(roleHandler(superAdminAccess), createNewCategoryWidgetValidator(), validate, CreateNewCategoryWidget)
  .put(roleHandler(superAdminAccess), updateCategoryWidgetValidator(), validate, updateCategoryWidget)
  .delete(roleHandler(superAdminAccess), deleteCategoryWidgetValidator(), validate, deleteCategoryWidget)
  .get(roleHandler(generalAdminAccess), getAllCategoryWidgetData);

router.route('/order/status').post(roleHandler(superAdminAccess), createNewOrderStatusValidator(), validate, createNewOrderStatus);

export default router;
