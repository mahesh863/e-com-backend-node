import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { UploadedFile } from 'express-fileupload';
import CustomError from '../utils/customErrors';
import cloudinaryFileUploader from '../utils/cloudinaryFileUploader';
import { CategoryWidgetInput } from '../model/categoryWidget.model';
import {
  createNewCategoryWidgetDAL,
  deleteCategoryWidgetDAL,
  getAllCategoryWidgetDataByIdDAL,
  getAllCategoryWidgetDataDAL,
  updateCategoryWidgetDAL,
} from '../dal/categoryWidget.dal';
import { getCollectionDataByIdDal } from '../dal/collection.dal';
import { getProductDetailsByForAdminIdDAL } from '../dal/product.dal';

interface CreateCategoryWidgetInterface {
  name: string;
  header: string;
  subHeader: string;
  cta: string;
  type: string;
  redirect: number;
}

interface UpdateCategoryWidgetInterface extends CreateCategoryWidgetInterface {
  id: number;
}

export const CreateNewCategoryWidget = expressAsyncHandler(async (req: Request<{}, {}, CreateCategoryWidgetInterface>, res: Response) => {
  const { name, header, subHeader, cta, type, redirect } = req.body;
  const categoryWidgetImage = req.files?.image as UploadedFile;

  if (!categoryWidgetImage) {
    throw new CustomError('Image is required', 400);
  }

  const uploadedImage = await cloudinaryFileUploader({
    filePath: categoryWidgetImage.tempFilePath,
    folderName: 'categoryWidget',
  });

  const newCategoryWidgetData: CategoryWidgetInput = {
    name,
    header,
    subHeader,
    cta,
    type,
    image: uploadedImage,
  };

  if (type === 'collection') {
    const collectionData = await getCollectionDataByIdDal(redirect);

    if (!collectionData) {
      throw new CustomError('Collection not found', 404);
    }

    newCategoryWidgetData['collection'] = redirect;
  } else if (type === 'product') {
    const collectionData = await getProductDetailsByForAdminIdDAL(redirect);

    if (!collectionData) {
      throw new CustomError('Product not found', 404);
    }

    newCategoryWidgetData['product'] = redirect;
  } else {
    throw new CustomError('Invalid type provided', 400);
  }

  await createNewCategoryWidgetDAL(newCategoryWidgetData);

  res.status(201).json({ message: 'Category widget created successfully' });
});

export const updateCategoryWidget = expressAsyncHandler(async (req: Request<{}, {}, UpdateCategoryWidgetInterface>, res: Response) => {
  const { id, type, redirect, ...dataToUpdate } = req.body;
  const categoryWidgetImage = req.files?.image as UploadedFile;

  const updateData: Partial<CategoryWidgetInput> = {
    ...dataToUpdate,
  };

  if (categoryWidgetImage) {
    const uploadedImage = await cloudinaryFileUploader({
      filePath: categoryWidgetImage.tempFilePath,
      folderName: 'categoryWidget',
    });
    updateData['image'] = uploadedImage;
  }

  if (type && !redirect) {
    throw new CustomError('Redirect is cannot be empty if you want to change the type', 400);
  }

  if (type) {
    updateData['type'] = type;
    if (type === 'collection') {
      updateData['collection'] = redirect;
    } else if (type === 'product') {
      updateData['product'] = redirect;
    } else {
      throw new CustomError('Invalid type provided', 400);
    }
  }
  const isUpdated = await updateCategoryWidgetDAL(updateData, id);

  if (!isUpdated) {
    throw new CustomError('No data updated', 400);
  }

  res.status(200).json({ message: 'Category widget updated successfully' });
});

export const deleteCategoryWidget = expressAsyncHandler(async (req: Request, res: Response) => {
  const deleteId = req.query.id as unknown as number;

  const isDeleted = await deleteCategoryWidgetDAL(deleteId);

  if (!isDeleted) {
    throw new CustomError('No data was deleted', 400);
  }

  res.status(200).json({ message: 'Category widget deleted successfully' });
});

export const getAllCategoryWidgetData = expressAsyncHandler(async (req: Request, res: Response) => {
  const allData = await getAllCategoryWidgetDataDAL();

  const resData = {
    data: allData,
  };

  res.status(200).json(resData);
});

export const getAllCategoryWidgetDataById = expressAsyncHandler(async (req: Request, res: Response) => {
  const id = req.query.id as unknown as number;

  if (!id) {
    throw new CustomError('Id is required', 400);
  }
  const categoryData = await getAllCategoryWidgetDataByIdDAL(id);

  const formattedData = {
    id: categoryData?.id,
    name: categoryData?.name,
    header: categoryData?.header,
    subHeader: categoryData?.subHeader,
    cta: categoryData?.cta,
    image: categoryData?.image,
    type: categoryData?.type,
    redirect: categoryData?.collection || categoryData?.product,
  };

  const resData = {
    data: formattedData,
  };

  res.status(200).json(resData);
});
