import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { addToCartDAL, getAllCartDAL, updateCartDAL, removeFromCartDAL, getCartByUserIdDAL } from '../dal/cart.dal';
import { CartInput } from '../model/cart.model';

export const getAllCartForAdmin = expressAsyncHandler(async (req: Request, res: Response) => {
  const allCategories = await getAllCartDAL();

  const resData = {
    cart: allCategories,
  };

  res.status(200).json(resData);
});

export const addToCart = expressAsyncHandler(async (req: Request<{}, {}, CartInput>, res: Response) => {
  const addToCart = req.body;

  await addToCartDAL(addToCart);

  const resData = {
    message: 'Cart added successfully',
  };

  res.status(200).json(resData);
});

export const updateCart = expressAsyncHandler(async (req: Request<{}, {}, CartInput>, res: Response) => {
  const cartData = req.body;

  const { id, totalQuantity } = cartData;

  if (id) {
    const isCartUpdated = await updateCartDAL(id, totalQuantity);

    if (isCartUpdated) {
      const resData = {
        message: 'Cart updated successfully',
      };

      res.status(200).json(resData);
    }
  } else {
    const resData = {
      message: 'Failed to update cart',
    };

    res.status(400).json(resData);
  }
});

export const deleteFromCart = expressAsyncHandler(async (req: Request, res: Response) => {
  const { cartId } = req.query;

  await removeFromCartDAL(Number(cartId));
  res.status(200).json({ message: 'Removed from cart successfully' });
});

export const getUserCart = expressAsyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.query;

  const cartData = await getCartByUserIdDAL(Number(userId));

  res.status(200).json({ data: cartData });
});
