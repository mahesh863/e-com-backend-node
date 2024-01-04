import logger from '../logger/index.logger';
import Cart, { CartInput, CartOutput } from '../model/cart.model';
import Product from '../model/product.model';
import User from '../model/user.model';
import CustomError from '../utils/customErrors';

export const getAllCartDAL = async (): Promise<CartOutput[]> => {
  const allCart = await Cart.findAll({
    include: [
      {
        model: User,
        attributes: ['id', 'name', 'email'],
      },
      {
        model: Product,
        attributes: ['id', 'name', 'sold', 'price'],
      },
    ],
    order: [['createdAt', 'DESC']],
  });

  return allCart;
};

export const addToCartDAL = async (payload: CartInput) => {
  try {
    const cartCheck = await Cart.findOne({
      where: {
        userId: payload.userId,
        productId: payload.productId,
      },
    });

    if (cartCheck) {
      await Cart.update(
        {
          totalQuantity: payload.totalQuantity,
        },
        {
          where: {
            id: cartCheck.id,
          },
        },
      );
      return;
    }

    await Cart.create(payload);
  } catch (error) {
    logger.error('failed to add to cart', error);
    throw new CustomError('Failed to add to cart', 500);
  }
};

export const updateCartDAL = async (cartId: number, quantity: number): Promise<boolean> => {
  try {
    const allCart = await Cart.update(
      {
        totalQuantity: quantity,
      },
      {
        where: {
          id: cartId,
        },
      },
    );
    return !!allCart;
  } catch (error) {
    logger.error('failed to update to cart', error);
    throw new CustomError('Failed to update to cart', 500);
  }
};

export const removeFromCartDAL = async (cartId: number) => {
  try {
    await Cart.destroy({
      where: {
        id: cartId,
      },
    });
  } catch (error) {
    logger.error('failed to remove from cart', error);
    throw new CustomError('Failed to remove from  cart', 500);
  }
};

export const getCartByUserIdDAL = async (userId: number): Promise<CartOutput[]> => {
  try {
    const userCart = await Cart.findAll({
      include: [
        {
          model: Product,
          attributes: ['id', 'name', 'price'],
        },
      ],

      where: {
        userId,
      },
    });

    return userCart;
  } catch (error) {
    logger.error('failed to get user cart', error);
    throw new CustomError('Failed to get user cart', 500);
  }
};
