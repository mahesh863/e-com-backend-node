import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { BannerInput } from '../model/banner.model';
import { UploadedFile } from 'express-fileupload';
import { createNewBannerDAL, updateBannerDAL, getBannerListDetailsDAL, getBannerDetailsByIdDAL } from '../dal/banner.dal';
import cloudinaryFileUploader from '../utils/cloudinaryFileUploader';
import CustomError from '../utils/customErrors';

export const createNewBanner = expressAsyncHandler(async (req: Request<{}, {}, BannerInput>, res: Response) => {
  const bodyData = req.body;

  const bannerImage = req.files?.bannerImage as UploadedFile;

  if (!bannerImage) {
    res.status(400).json({ message: 'Banner image is required' });
    return;
  }

  const uploadedLink = await cloudinaryFileUploader({ filePath: bannerImage.tempFilePath, folderName: 'banner' });

  const newBannerPayload: BannerInput = {
    ...bodyData,
    imageUrl: uploadedLink,
  };

  await createNewBannerDAL(newBannerPayload);

  res.status(201).json({ message: 'Banner created successfully' });
});

export const updateBanner = expressAsyncHandler(async (req: Request<{}, {}, BannerInput>, res: Response) => {
  const { id, ...bodyData } = req.body;

  if (!id) {
    res.status(400).json({ message: 'Banner id is required' });
    return;
  }

  const bannerImage = req.files?.bannerImage as UploadedFile;

  const newBannerPayload: Partial<BannerInput> = {
    ...bodyData,
  };

  if (bannerImage) {
    const uploadedLink = await cloudinaryFileUploader({ filePath: bannerImage.tempFilePath, folderName: 'banner' });
    newBannerPayload.imageUrl = uploadedLink;
  }

  await updateBannerDAL(newBannerPayload, id);

  res.status(200).json({ message: 'Banner updated successfully' });
});

export const getBannerListDetails = expressAsyncHandler(async (req: Request<{}, {}, BannerInput>, res: Response) => {
  const data = await getBannerListDetailsDAL();

  res.status(200).json({ data: data });
});

export const getBannerDetailsById = expressAsyncHandler(async (req: Request<{}, {}, BannerInput>, res: Response) => {
  const id = req.query?.id as unknown as number;

  if (!id) {
    throw new CustomError('Banner id is required', 400);
  }

  const data = await getBannerDetailsByIdDAL(id);

  res.status(200).json({ data });
});
