import { sequelizeConnection } from '../config';
import logger from '../logger/index.logger';
import Home, { HomeInput } from '../model/home.model';
import Widget from '../model/widget.model';
import WidgetType from '../model/widgetType.model';
import CustomError from '../utils/customErrors';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const getHomeListDAL = async (): Promise<any[]> => {
  const homeList = await Home.findAll({
    order: [['position', 'ASC']],
    attributes: ['id', 'widget'],
    include: [
      {
        model: Widget,
        attributes: ['id', 'name', 'type'],
        include: [
          {
            model: WidgetType,
            attributes: ['name'],
          },
        ],
      },
    ],
  });

  return homeList;
};

export const createHomeDAL = async (homeData: HomeInput[]) => {
  const transaction = await sequelizeConnection.transaction();

  try {
    await Home.destroy({
      transaction: transaction,
      where: {},
    });

    await Home.bulkCreate(homeData);
    transaction.commit();
  } catch (err) {
    transaction.rollback();
    logger.error('failed to create home', err);
    throw new CustomError('Error in creating home', 500);
  }
};
