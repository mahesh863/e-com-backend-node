import expressAsyncHandler from 'express-async-handler';
import { CategoryInput } from '../model/category.model';
import {
  createCategory,
  deleteCategoryById,
  getAllCategoryDAL,
  getAllPublicCategoryDAL,
  getCategoryByName,
  updateCategoryById,
  updateCategoryVisibility,
} from '../dal/category.dal';
import { Request, Response } from 'express';
import cloudinaryFileUploader from '../utils/cloudinaryFileUploader';
import { UploadedFile } from 'express-fileupload';
import logger from '../logger/index.logger';
import CustomError from '../utils/customErrors';

interface VisibilityInterface {
  categoryIds: number[];
  visibility: boolean;
}

export const createNewCategory = expressAsyncHandler(async (req: Request<{}, {}, CategoryInput>, res: Response) => {
  const newCategoryData = req.body;
  let categoryImage = req.files?.categoryImage;

  const categoryDetails = await getCategoryByName(newCategoryData.name);

  if (categoryDetails) {
    throw new CustomError('Category already exists', 400);
  }

  if (categoryImage) {
    categoryImage = categoryImage as UploadedFile;
    const secureUrl = await cloudinaryFileUploader({
      filePath: categoryImage.tempFilePath,
      folderName: 'category',
    });
    newCategoryData.image = secureUrl;
  }

  await createCategory(newCategoryData);

  res.status(201).json({ message: 'Category created successfully' });
});

export const updateCategory = expressAsyncHandler(async (req: Request<{}, {}, Partial<CategoryInput>>, res: Response) => {
  try {
    const { id, ...otherData } = req.body;
    let categoryImage = req.files?.categoryImage;

    if (categoryImage) {
      categoryImage = categoryImage as UploadedFile;
      const secureUrl = await cloudinaryFileUploader({
        filePath: categoryImage.tempFilePath,
        folderName: 'category',
      });
      otherData.image = secureUrl;
    }
    await updateCategoryById(id!, otherData);
    res.status(200).json({ message: 'Category updated successfully' });
  } catch (error) {
    logger.error('Error in updating category:', error);
    throw new CustomError('Failed to update category', 500);
  }
});

export const deleteCategory = expressAsyncHandler(async (req: Request, res: Response) => {
  const { id } = req.query;
  await deleteCategoryById(Number(id));
  res.status(200).json({ message: 'Category deleted successfully' });
});

export const changeCategoryVisibility = expressAsyncHandler(async (req: Request<{}, {}, VisibilityInterface>, res: Response) => {
  const { categoryIds, visibility } = req.body;

  await updateCategoryVisibility(categoryIds, visibility);
  res.status(200).json({ message: 'Category visibility updated successfully' });
});

export const getAllCategory = expressAsyncHandler(async (req: Request, res: Response) => {
  const allCategories = await getAllCategoryDAL();

  const resData = {
    categories: allCategories,
  };

  res.status(200).json(resData);
});

export const getAllPublicCategory = expressAsyncHandler(async (req: Request, res: Response) => {
  const allCategories = await getAllPublicCategoryDAL();

  const resData = {
    categories: allCategories,
  };

  res.status(200).json(resData);
});
