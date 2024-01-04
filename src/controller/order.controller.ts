import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { OrderInput } from '../model/order.model';
import { createNewOrderDAL, placeOrderDAL } from '../dal/order.dal';
import GenericBody from '../interface/GenericBody';
import { OrderItemsInput } from '../model/orderItems.model';
import { AddressInput } from '../model/address.model';
import { getOrderStatusByNameDAL } from '../dal/orderStatus.dal';
import CustomError from '../utils/customErrors';
import { getAllProductDetailsByIdDAL } from '../dal/product.dal';

interface CreateOrderRequest extends GenericBody {
  products: OrderItemsInput[];
  address: AddressInput;
}

interface UpdateOrderRequest extends GenericBody {
  orderId: number;
  transactionId: string;
}

const validateProducts = (products: OrderItemsInput[]): boolean => {
  let isValid = true;

  products.map((product) => {
    if (!product.productId || !product.productQuantity) {
      isValid = false;
    }
  });

  return isValid;
};

const checkStockAndCalculateProductTotal = async (products: OrderItemsInput[], orderStatusId: number): Promise<OrderItemsInput[]> => {
  const updatedAndValidatedProductDetails = await Promise.all(
    products.map(async (product) => {
      const productDetails = await getAllProductDetailsByIdDAL(product.productId!);
      if (productDetails) {
        if (productDetails.stock! < product.productQuantity) {
          throw new CustomError('Not enough stock', 400);
        }

        product.totalAmount = (productDetails.price! * product.productQuantity).toString();
        product.orderStatusId = orderStatusId;
        return product;
      } else {
        throw new CustomError('One or more product not found', 400);
      }
    }),
  );

  return updatedAndValidatedProductDetails;
};

export const createOrder = expressAsyncHandler(async (req: Request<{}, {}, CreateOrderRequest>, res: Response) => {
  const { products, address, user } = req.body;

  if (!products || !address || !user) {
    throw new CustomError('Products and address is required', 400);
  }

  if (!products.length) {
    throw new CustomError('Products is required', 400);
  }

  if (!validateProducts(products)) {
    throw new CustomError('Please send proper products', 400);
  }

  if (
    !address.name ||
    !address.address1 ||
    !address.address2 ||
    !address.pinCode ||
    !address.city ||
    !address.state ||
    !address.email ||
    !address.phoneNumber
  ) {
    throw new CustomError('Please send proper address', 400);
  }

  const orderStatus = await getOrderStatusByNameDAL('Pending');

  if (!orderStatus) {
    throw new CustomError('Order status not found', 400);
  }

  const updatedAndValidatedProductDetails = await checkStockAndCalculateProductTotal(products, orderStatus.id);

  const newOrder: OrderInput = {
    userId: user.id,
  };

  const createdOrder = await createNewOrderDAL(updatedAndValidatedProductDetails, newOrder, address);

  if (createdOrder) {
    res.status(200).json({
      message: 'Order created successfully',
      data: createdOrder.id,
    });
  } else {
    res.status(400).json({
      message: 'Order creation failed',
    });
  }
});

export const placeOrder = expressAsyncHandler(async (req: Request<{}, {}, UpdateOrderRequest>, res: Response) => {
  const { orderId, transactionId } = req.body;

  if (!orderId || !transactionId) {
    throw new CustomError('Order id and transaction id is required', 400);
  }

  await placeOrderDAL(orderId, transactionId);
  res.status(200).json({
    message: 'Order placed successfully',
  });
});
