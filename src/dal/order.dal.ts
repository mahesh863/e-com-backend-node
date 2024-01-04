import { sequelizeConnection } from '../config';
import { AddressInput } from '../model/address.model';
import Order, { OrderInput } from '../model/order.model';
import OrderItems, { OrderItemsInput } from '../model/orderItems.model';
import CustomError from '../utils/customErrors';
import { addAddressDAL } from './address.dal';
import { updateOrderItemsStatus } from './orderItems.dal';
import { getOrderStatusByNameDAL } from './orderStatus.dal';

export const createNewOrderDAL = async (products: OrderItemsInput[], newOrder: OrderInput, address: AddressInput): Promise<Order | undefined> => {
  const transaction = await sequelizeConnection.transaction();

  try {
    const newOrderItems = await OrderItems.bulkCreate(products, { transaction });

    const orderItemsIds = newOrderItems.map((orderItem) => orderItem.id);
    const createdOrder = await Order.create(newOrder, { transaction });
    await createdOrder.addOrderItems(orderItemsIds, { transaction });
    address.orderId = createdOrder.id;
    address.userId = createdOrder.userId;
    await addAddressDAL(address, transaction);

    await transaction.commit();
    return createdOrder;
  } catch (error) {
    console.log('error : ', error);

    await transaction.rollback();
  }
};

export const placeOrderDAL = async (orderId: number, transactionId: string) => {
  const order = await Order.findByPk(orderId, {
    include: [
      {
        model: OrderItems,
        through: { attributes: [] },
        as: 'orderItems',
        attributes: ['id'],
      },
    ],
  });
  if (!order) {
    throw new CustomError('Order not found', 400);
  }

  const orderItemIds = order.orderItems.map((orderItem) => {
    return orderItem.id;
  });

  const orderStatus = await getOrderStatusByNameDAL('Ordered');

  if (!orderStatus) {
    throw new CustomError('Order status not found', 400);
  }

  const transaction = await sequelizeConnection.transaction();

  await updateOrderItemsStatus(orderItemIds, orderStatus.id, transaction);
  order.transactionId = transactionId;

  await order.save({
    transaction,
  });

  transaction.commit();
};
