import { Router as expressRouter } from 'express';
import { createOrder, placeOrder } from '../controller/order.controller';

const router = expressRouter();

router.route('/order/create').post(createOrder).put(placeOrder);

export default router;
