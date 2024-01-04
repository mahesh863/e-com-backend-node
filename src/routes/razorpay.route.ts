import { Router as expressRouter } from 'express';
import { createRazorpayOrder, verifyRazorpayPayment } from '../controller/razorpay.controller';

const router = expressRouter();

router.route('/create-order').post(createRazorpayOrder);
router.route('/verify-payment').post(verifyRazorpayPayment);

export default router;
