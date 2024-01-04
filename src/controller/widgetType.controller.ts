import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import logger from '../logger/index.logger';
import { WidgetTypeInput } from '../model/widgetType.model';
import { createNewWidgetTypeDAL, getAllWidgetTypeListDAL, getWidgetTypeByName } from '../dal/widgetType.dal';
import CustomError from '../utils/customErrors';

export const createNewWidgetType = expressAsyncHandler(async (req: Request<{}, {}, WidgetTypeInput>, res: Response) => {
  logger.info('create new widget type');

  const data = req.body;

  const checkIfWidgetTypeExist = await getWidgetTypeByName(data.name);

  if (checkIfWidgetTypeExist) {
    logger.error('Widget type already exist');
    throw new CustomError('Widget type already exist', 400);
  }

  await createNewWidgetTypeDAL(data);
  logger.info('New widget type created');

  res.status(200).json({ message: 'New widget type created' });
});

export const getWidgetTypeList = expressAsyncHandler(async (req: Request, res: Response) => {
  logger.info('getting widget type list');

  const widgetType = await getAllWidgetTypeListDAL();

  res.status(200).json({ data: widgetType });
});
