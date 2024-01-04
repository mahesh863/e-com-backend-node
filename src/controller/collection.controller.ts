import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { UploadedFile } from 'express-fileupload';
import logger from '../logger/index.logger';
import CustomError from '../utils/customErrors';
import cloudinaryFileUploader from '../utils/cloudinaryFileUploader';
import { createCollectionDal, getAllCollectionDal, getAllCollectionDetailsDal, getCollectionByName } from '../dal/collection.dal';
import { getProductListByIds } from '../dal/product.dal';
import { CollectionInput } from '../model/collection.model';

interface CreateNewCollectionInterface {
  name: string;
  productIds: string;
}

export const createNewCollection = expressAsyncHandler(async (req: Request<{}, {}, CreateNewCollectionInterface>, res: Response) => {
  try {
    const { name, productIds } = req.body;

    const products: number[] = productIds.split(',').map((id) => parseInt(id));

    console.log(products, 'products');

    const bannerImage = req.files?.bannerImage as UploadedFile;

    const collectionData = await getCollectionByName(name);

    if (collectionData) {
      res.status(400).json({
        message: 'Collection with same name already exists',
      });
      return;
    }

    const checkForProducts = await getProductListByIds(products);

    console.log(checkForProducts.length, 'checkForProducts');

    if (checkForProducts.length !== products.length) {
      res.status(400).json({
        message: 'Some of the products are missing',
      });
      return;
    }

    const newCollectionData: {
      name?: string;
      bannerImage?: string;
    } = {};

    newCollectionData['name'] = name;

    if (bannerImage) {
      const secureUrl = await cloudinaryFileUploader({
        filePath: bannerImage.tempFilePath,
        folderName: 'collection',
      });
      newCollectionData['bannerImage'] = secureUrl;
    }

    const createdData = await createCollectionDal(newCollectionData as CollectionInput);

    await createdData.addProducts(products);

    res.status(200).json({
      message: 'Collection created successfully',
    });
  } catch (error) {
    logger.error('failed to create new collection: ', error);
    throw new CustomError('Failed to create new collection', 500);
  }
});

export const getAllCollection = expressAsyncHandler(async (req: Request, res: Response) => {
  logger.info('getting collection list');
  const allData = await getAllCollectionDal();
  res.status(200).json({ data: allData });
});

export const getCollectionDetails = expressAsyncHandler(async (req: Request, res: Response) => {
  const collectionId = req.query?.collectionId as unknown as number;

  logger.info('getting collection details');

  const allData = await getAllCollectionDetailsDal(collectionId);
  res.status(200).json({ data: allData });
});
