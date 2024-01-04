import OrderStatus from '../model/orderStatus.model';

export const createNewOrderStatusDAL = async (name: string) => {
  await OrderStatus.create({
    name,
  });
};

export const getAllOrderStatusDAL = async (): Promise<OrderStatus[]> => {
  const orderStatus = await OrderStatus.findAll();
  return orderStatus;
};

export const getOrderStatusByNameDAL = async (name: string): Promise<OrderStatus | null> => {
  const orderStatus = await OrderStatus.findOne({
    where: {
      name,
    },
  });
  return orderStatus;
};
