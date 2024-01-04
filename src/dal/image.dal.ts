import logger from '../logger/index.logger';
import CustomError from '../utils/customErrors';
import Image, { ImageInput } from '../model/image.mode';

export const insertImageInBulk = async (paylaod: ImageInput[]) => {
  try {
    await Image.bulkCreate(paylaod);
    logger.info('images inserted successfully');
  } catch (error) {
    logger.error('error in inserting images in bulk: ', error);
    throw new CustomError('Failed to insert images in bulk', 500);
  }
};
