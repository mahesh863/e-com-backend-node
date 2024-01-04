import expressAsyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import cloudinaryFileUploader from '../utils/cloudinaryFileUploader';
import { UploadedFile } from 'express-fileupload';
import logger from '../logger/index.logger';
import CustomError from '../utils/customErrors';
import { ProductInput } from '../model/product.model';
import {
  createProduct,
  deleteProductById,
  getAllProductDAL,
  getAllPublicProductByCategoryDAL,
  getAllPublicProductDAL,
  searchProductsDal,
  updateProductById,
  updateProductVisibility,
  getAllPublicProductListDAL,
  getProductDetailsByForAdminIdDAL,
  getProductDetailsByIdDAL,
} from '../dal/product.dal';
import { ImageInput } from '../model/image.mode';
import { insertImageInBulk } from '../dal/image.dal';

interface VisibilityInterface {
  productIds: number[];
  visibility: boolean;
}

export const createNewProduct = expressAsyncHandler(async (req: Request<{}, {}, ProductInput>, res: Response) => {
  try {
    const newProductData = req.body;
    const productImages = req.files;
    let imageUrls: ImageInput[];

    const createdProduct = await createProduct(newProductData);

    if (productImages) {
      const imageData = Object.values(productImages) as UploadedFile[];

      imageUrls = await Promise.all(
        imageData.map(async (val) => {
          const uploadedImage = await cloudinaryFileUploader({
            filePath: val.tempFilePath,
            folderName: 'products',
          });

          const returnData: ImageInput = {
            url: uploadedImage,
            productId: createdProduct.id,
          };

          return returnData;
        }),
      );

      await insertImageInBulk(imageUrls);
    }

    res.status(201).json({ message: 'Product created successfully' });
  } catch (error) {
    logger.error('Error in creating product:', error);
    throw new CustomError('Failed to create product', 500);
  }
});

export const updateProducts = expressAsyncHandler(async (req: Request<{}, {}, ProductInput>, res: Response) => {
  try {
    const newProductData = req.body;
    const productImages = req.files;
    let imageUrls: ImageInput[];

    const { id, ...otherData } = newProductData;

    if (productImages) {
      const imageData = Object.values(productImages) as UploadedFile[];

      imageUrls = await Promise.all(
        imageData.map(async (val) => {
          const uploadedImage = await cloudinaryFileUploader({
            filePath: val.tempFilePath,
            folderName: 'products',
          });

          const returnData: ImageInput = {
            url: uploadedImage,
            productId: id,
          };

          return returnData;
        }),
      );

      await insertImageInBulk(imageUrls);
    }

    await updateProductById(id!, otherData);

    res.status(201).json({ message: 'Product updated successfully successfully' });
  } catch (error) {
    logger.error('Error in creating product:', error);
    throw new CustomError('Failed to create product', 500);
  }
});

export const deleteProducts = expressAsyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    const isDeleted = await deleteProductById(Number(id));

    if (!isDeleted) {
      throw new CustomError('Failed to delete product', 400);
    }

    res.status(201).json({ message: 'Product deleted successfully' });
  } catch (error) {
    logger.error('Error in creating product:', error);
    throw new CustomError('Failed to create product', 500);
  }
});

export const changeProductVisibility = expressAsyncHandler(async (req: Request<{}, {}, VisibilityInterface>, res: Response) => {
  const { productIds, visibility } = req.body;
  await updateProductVisibility(productIds, visibility);
  res.status(200).json({ message: 'Selected products are marked as publicly visible' });
});

export const getAllPublicProducts = expressAsyncHandler(async (req: Request, res: Response) => {
  const allProduct = await getAllPublicProductDAL();

  const resData = {
    data: allProduct,
  };

  res.status(200).json(resData);
});

export const getAllProducts = expressAsyncHandler(async (req: Request, res: Response) => {
  const allProducts = await getAllProductDAL();

  const resData = {
    data: allProducts,
  };

  res.status(200).json(resData);
});

export const getAllPublicProductByCategory = expressAsyncHandler(async (req: Request, res: Response) => {
  const { categoryId } = req.params;

  if (!categoryId) {
    throw new CustomError('Category id is required', 400);
  }

  const allProducts = await getAllPublicProductByCategoryDAL(Number(categoryId));

  const resData = {
    data: allProducts,
  };

  res.status(200).json(resData);
});

export const searchProducts = expressAsyncHandler(async (req: Request, res: Response) => {
  const { search } = req.query;
  if (!search) {
    throw new CustomError('Search term is required', 400);
  }

  const searchString = String(search);

  const allProducts = await searchProductsDal(searchString);

  const resData = {
    data: allProducts,
  };

  res.status(200).json(resData);
});
export const getAllPublicProductByCompany = expressAsyncHandler(async (req: Request, res: Response) => {
  const { companyId } = req.params;

  if (!companyId) {
    throw new CustomError('Company id is required', 400);
  }

  const allProducts = await getAllPublicProductByCategoryDAL(Number(companyId));

  const resData = {
    data: allProducts,
  };

  res.status(200).json(resData);
});

export const getPublicProductList = expressAsyncHandler(async (req: Request, res: Response) => {
  const allProducts = await getAllPublicProductListDAL();

  const resData = {
    data: allProducts,
  };

  res.status(200).json(resData);
});

export const getProductDetailsById = expressAsyncHandler(async (req: Request, res: Response) => {
  const productId = req.query?.id as unknown as number;

  if (!productId) {
    throw new CustomError('Product id is required', 400);
  }

  const product = await getProductDetailsByIdDAL(productId);

  const formattedData = {
    id: product?.id,
    name: product?.name,
    description: product?.description,
    price: product?.price,
    images: product?.Images?.map((val) => val.url),
  };

  const resData = {
    data: formattedData,
  };

  res.status(200).json(resData);
});

export const getProductDetailsForAdminById = expressAsyncHandler(async (req: Request, res: Response) => {
  const productId = req.query?.id as unknown as number;

  if (!productId) {
    throw new CustomError('Product id is required', 400);
  }

  const product = await getProductDetailsByForAdminIdDAL(productId);

  const resData = {
    data: product,
  };

  res.status(200).json(resData);
});
