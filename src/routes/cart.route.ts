import { Router as expressRouter } from 'express';
import { addToCart, deleteFromCart, getUserCart, updateCart } from '../controller/cart.controller';
import { addToCartValidator, deleteFromCartValidator, getUserCartValidator, updateCartValidator } from '../validator/cart.validator';
import validate from '../validator/validate.validators';

const router = expressRouter();

router
  .route('/cart')
  .post(addToCartValidator(), validate, addToCart)
  .put(updateCartValidator(), validate, updateCart)
  .delete(deleteFromCartValidator(), validate, deleteFromCart)
  .get(getUserCartValidator(), validate, getUserCart);

export default router;
