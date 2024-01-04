import logger from '../logger/index.logger';
import Category, { CategoryInput, CategoryOutput } from '../model/category.model';
import CustomError from '../utils/customErrors';

export const createCategory = async (payload: CategoryInput): Promise<CategoryOutput> => {
  try {
    const category = await Category.create(payload);
    logger.info('new category created successfully');
    return category;
  } catch (error) {
    logger.error('error in creating new category: ', error);
    throw new CustomError();
  }
};

export const getCategoryByName = async (name: string): Promise<CategoryOutput | null> => {
  try {
    const category = await Category.findOne({ where: { name } });
    return category;
  } catch (error) {
    logger.error('error in finding category by name: ', error);
    throw new CustomError('Failed to create new category', 500);
  }
};

export const updateCategoryById = async (id: number, payload: Partial<CategoryInput>) => {
  try {
    await Category.update(payload, {
      where: {
        id,
      },
    });

    logger.info('category updated successfully');
  } catch (error) {
    logger.error('error in updating category: ', error);
    throw new CustomError('Failed to update category', 500);
  }
};

export const deleteCategoryById = async (id: number): Promise<boolean> => {
  try {
    const count = await Category.destroy({
      where: {
        id,
      },
    });
    logger.info('category deleted successfully');
    return !!count;
  } catch (error) {
    logger.error('error in deleting category: ', error);
    throw new CustomError('Failed to delete category', 500);
  }
};

export const updateCategoryVisibility = async (id: number[], status: boolean) => {
  try {
    await Category.update({ isPublic: status }, { where: { id } });
  } catch (error) {
    logger.error(error);
    logger.error('failed to update visibility', error);
    throw new CustomError('Failed to update visibility', 500);
  }
};

export const getAllPublicCategoryDAL = async (): Promise<CategoryOutput[]> => {
  try {
    const allCategories = await Category.findAll({
      attributes: ['id', 'name', 'image'],
      where: {
        isPublic: true,
      },
    });

    return allCategories;
  } catch (error) {
    logger.error('failed to get all categories', error);
    throw new CustomError('Failed to get all categories', 500);
  }
};

export const getAllCategoryDAL = async (): Promise<CategoryOutput[]> => {
  try {
    const allCategories = await Category.findAll({
      attributes: ['id', 'name', 'image', 'isPublic'],
    });

    return allCategories;
  } catch (error) {
    logger.error('failed to get all categories', error);
    throw new CustomError('Failed to get all categories', 500);
  }
};
