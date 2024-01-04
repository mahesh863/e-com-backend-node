import { v2 as cloudinary } from 'cloudinary';
import logger from '../logger/index.logger';
import CustomError from './customErrors';

interface IUploadFile {
  filePath: string;
  folderName: string;
}

const cloudinaryFileUploader = async (data: IUploadFile): Promise<string> => {
  try {
    const uploadedDetails = await cloudinary.uploader.upload(data.filePath, {
      folder: data.filePath,
    });

    return uploadedDetails.secure_url;
  } catch (err) {
    logger.log('failed to upload file to cloudinary: ', err);
    throw new CustomError('failed to upload file to cloudinary', 500);
  }
};

export default cloudinaryFileUploader;
