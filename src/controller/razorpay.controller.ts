import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import crypto from 'crypto';
import Razorpay from 'razorpay';

export const createRazorpayOrder = expressAsyncHandler(async (req: Request, res: Response) => {
  const { amount } = req.body;
  const keyId = process.env.RAZORPAY_KEY_ID as string;
  const secret = process.env.RAZORPAY_SECRET as string;

  const instance = new Razorpay({ key_id: keyId, key_secret: secret });

  const options = {
    amount: amount,
    currency: 'INR',
    receipt: 'order_receipt_01',
  };
  const order = await instance.orders.create(options);

  res.status(200).json({
    success: true,
    data: order.id,
  });
});

export const verifyRazorpayPayment = expressAsyncHandler(async (req: Request, res: Response) => {
  const { orderId, razorpayPaymentId, razorpaySignature } = req.body;

  const secret = process.env.RAZORPAY_SECRET as string;

  const message = `${orderId}|${razorpayPaymentId}`;

  const generatedSignature = crypto.createHmac('sha256', secret).update(message).digest('hex');

  if (generatedSignature == razorpaySignature) {
    res.status(200).json({
      success: true,
      message: 'Payment successful',
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Payment failed',
    });
  }
});
