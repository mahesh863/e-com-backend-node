import { Transaction } from 'sequelize';
import OrderItems from '../model/orderItems.model';

export const updateOrderItemsStatus = async (orderItems: number[], orderStatusId: number, transaction: Transaction): Promise<boolean> => {
  const updated = await OrderItems.update({ orderStatusId }, { where: { id: orderItems }, transaction });
  return !!updated;
};
