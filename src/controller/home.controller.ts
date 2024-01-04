import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { createHomeDAL, getHomeListDAL } from '../dal/home.dal';
import logger from '../logger/index.logger';
import { HomeInput } from '../model/home.model';
import CustomError from '../utils/customErrors';

export const getHomeWidget = expressAsyncHandler(async (req: Request, res: Response) => {
  const homeList = await getHomeListDAL();

  const formattedHomeList = homeList.map((home) => {
    return {
      id: home.id,
      widgetId: home.widget,
      widgetName: home?.Widget.WidgetType?.name,
    };
  });

  res.status(200).json({
    data: formattedHomeList,
  });
});

export const adminHomeDetails = expressAsyncHandler(async (req: Request, res: Response) => {
  const homeList = await getHomeListDAL();

  const formattedHomeList = homeList.map((home) => {
    return {
      id: home.id,
      widgetId: home.widget,
      widgetTypeName: home?.Widget.WidgetType?.name,
      widgetName: home?.Widget?.name,
    };
  });

  res.status(200).json({
    data: formattedHomeList,
  });
});

export const createHomeController = expressAsyncHandler(async (req: Request<{}, {}, HomeInput[]>, res: Response) => {
  logger.info('creating home controller');

  const homeData = req.body;

  if (homeData.length === 0) {
    throw new CustomError('home data cannot empty');
  }

  await createHomeDAL(homeData);

  res.status(200).json({
    message: 'home data created successfully',
  });
});
