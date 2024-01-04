import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { OrderStatusInput } from '../model/orderStatus.model';
import { createNewOrderStatusDAL, getAllOrderStatusDAL } from '../dal/orderStatus.dal';

export const createNewOrderStatus = expressAsyncHandler(async (req: Request<{}, {}, OrderStatusInput>, res: Response) => {
  const { name } = req.body;

  await createNewOrderStatusDAL(name);

  res.status(201).json({ message: 'Order status created' });
});

export const getAllOrderStatus = expressAsyncHandler(async (req: Request<{}, {}, OrderStatusInput>, res: Response) => {
  const allOrderStatus = await getAllOrderStatusDAL();
  res.status(200).json({ data: allOrderStatus });
});
