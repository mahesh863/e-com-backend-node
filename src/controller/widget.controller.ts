import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import logger from '../logger/index.logger';
import { WidgetInput } from '../model/widget.model';
import { createNewWidgetDAL, getAllWidgetDAL, getAllWidgetDataDAL } from '../dal/widget.dal';
import { getWidgetTypeById } from '../dal/widgetType.dal';
import CustomError from '../utils/customErrors';

export const createNewWidget = expressAsyncHandler(async (req: Request<{}, {}, WidgetInput>, res: Response) => {
  logger.info('create new widget');

  const newData = req.body;

  if (newData.type) {
    const widgetTypeData = await getWidgetTypeById(newData.type);

    if (!widgetTypeData) {
      throw new CustomError('Widget type not found', 404);
    }
  }

  await createNewWidgetDAL(newData);

  res.status(200).json({
    status: true,
    message: 'Create new widget successfully',
  });
});

export const getAllWidget = expressAsyncHandler(async (req: Request, res: Response) => {
  logger.info('get all widget');

  const allWidgetData = await getAllWidgetDAL();

  res.status(200).json({
    status: true,
    data: allWidgetData,
  });
});

export const getWidgetData = expressAsyncHandler(async (req: Request, res: Response) => {
  const id = req.query?.id as unknown as number;

  if (!id) {
    throw new CustomError('Widget id is required', 400);
  }

  logger.info('get widget data');

  const widgetData = await getAllWidgetDataDAL(id);

  res.status(200).json({
    status: true,
    data: widgetData?.widgetData || [],
  });
});
