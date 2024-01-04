import { Op } from 'sequelize';
import logger from '../logger/index.logger';
import Category from '../model/category.model';
import Company from '../model/company.model';
import Product, { ProductInput, ProductOutput } from '../model/product.model';
import CustomError from '../utils/customErrors';
import Image from '../model/image.mode';

export const createProduct = async (payload: ProductInput): Promise<ProductOutput> => {
  try {
    const product = await Product.create(payload);
    return product;
  } catch (error) {
    logger.error('error in creating new product: ', error);
    throw new CustomError('Failed to create product', 500);
  }
};

export const updateProductById = async (id: number, payload: Partial<ProductInput>): Promise<boolean> => {
  try {
    const product = await Product.update(payload, {
      where: {
        id,
      },
    });
    return !!product;
  } catch (error) {
    logger.error('error in updating products: ', error);
    throw new CustomError('Failed to update product', 500);
  }
};

export const deleteProductById = async (id: number): Promise<boolean> => {
  try {
    const product = await Product.destroy({
      where: {
        id,
      },
    });
    return !!product;
  } catch (error) {
    logger.error('error in deleting products: ', error);
    throw new CustomError('Failed to delete product', 500);
  }
};

export const updateProductVisibility = async (id: number[], status: boolean) => {
  try {
    await Product.update({ isPublic: status }, { where: { id } });
  } catch (error) {
    logger.error(error);
    throw new CustomError('Failed to update product visibility', 500);
  }
};

export const getAllPublicProductDAL = async (): Promise<ProductOutput[]> => {
  try {
    const allProducts = await Product.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'categoryId', 'companyId', 'deletedAt', 'sold', 'stock'],
      },
      include: [
        {
          model: Category,
          attributes: ['name'],
        },
        {
          model: Company,
          attributes: ['name'],
        },
      ],
      where: {
        isPublic: true,
      },
      order: [['id', 'DESC']],
    });

    return allProducts;
  } catch (error) {
    logger.error('failed to get all products', error);
    throw new CustomError('Failed to get all products', 500);
  }
};

export const getAllPublicProductListDAL = async (): Promise<ProductOutput[]> => {
  try {
    const allProducts = await Product.findAll({
      attributes: ['id', 'name'],

      where: {
        isPublic: true,
      },
      order: [['id', 'DESC']],
    });

    return allProducts;
  } catch (error) {
    logger.error('failed to get all products', error);
    throw new CustomError('Failed to get all products', 500);
  }
};

export const getAllProductDAL = async (): Promise<ProductOutput[]> => {
  try {
    const allProducts = await Product.findAll({
      order: [['id', 'DESC']],
    });

    return allProducts;
  } catch (error) {
    logger.error('failed to get all products', error);
    throw new CustomError('Failed to get all products', 500);
  }
};

export const getAllPublicProductByCompanyDAL = async (companyId: number): Promise<ProductOutput[]> => {
  try {
    const allProducts = await Product.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'categoryId', 'companyId', 'deletedAt', 'sold', 'stock'],
      },
      include: [
        {
          model: Category,
          attributes: ['name'],
        },
        {
          model: Company,
          attributes: ['name'],
          where: {
            id: companyId,
          },
        },
      ],
      where: {
        isPublic: true,
      },
      order: [['id', 'DESC']],
    });

    return allProducts;
  } catch (error) {
    logger.error('failed to get all products', error);
    throw new CustomError('Failed to get all products', 500);
  }
};

export const getAllPublicProductByCategoryDAL = async (categoryId: number): Promise<ProductOutput[]> => {
  try {
    const allProducts = await Product.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'categoryId', 'companyId', 'deletedAt', 'sold', 'stock'],
      },
      include: [
        {
          model: Category,
          attributes: ['name'],
          where: {
            id: categoryId,
          },
        },
        {
          model: Company,
          attributes: ['name'],
        },
      ],
      where: {
        isPublic: true,
      },
      order: [['id', 'DESC']],
    });

    return allProducts;
  } catch (error) {
    logger.error('failed to get all products', error);
    throw new CustomError('Failed to get all products', 500);
  }
};

export const searchProductsDal = async (searchTerm: string): Promise<ProductOutput[]> => {
  try {
    const allProducts = await Product.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'categoryId', 'companyId', 'deletedAt', 'sold', 'stock'],
      },
      include: [
        {
          model: Category,
          attributes: ['name'],
        },
        {
          model: Company,
          attributes: ['name'],
        },
      ],
      where: {
        isPublic: true,
        [Op.or]: [
          {
            name: {
              [Op.iLike]: `%${searchTerm}%`,
            },
          },
        ],
      },
      order: [['id', 'DESC']],
    });

    return allProducts;
  } catch (error) {
    logger.error('failed to get all products', error);
    throw new CustomError('Failed to get all products', 500);
  }
};

export const getProductDetailsByForAdminIdDAL = async (productId: number): Promise<ProductOutput | null> => {
  const productDetails = await Product.findByPk(productId);
  return productDetails;
};

export const getProductDetailsByIdDAL = async (productId: number): Promise<ProductOutput | null> => {
  const productDetails = await Product.findByPk(productId, {
    attributes: ['id', 'name', 'description', 'price'],
    include: [
      {
        model: Image,
        attributes: ['url'],
      },
    ],
  });
  return productDetails;
};

export const getAllProductDetailsByIdDAL = async (productId: number): Promise<ProductOutput | null> => {
  const productDetails = await Product.findByPk(productId);
  return productDetails;
};

export const getProductListByIds = async (productIds: number[]): Promise<ProductOutput[]> => {
  const allProducts = await Product.findAll({
    where: {
      id: productIds,
    },
  });

  return allProducts;
};
