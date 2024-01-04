import WidgetType, { WidgetTypeInput, WidgetTypeOutput } from '../model/widgetType.model';

export const createNewWidgetTypeDAL = async (data: WidgetTypeInput) => {
  await WidgetType.create(data);
};

export const getWidgetTypeByName = async (name: string): Promise<WidgetTypeOutput | null> => {
  const data = await WidgetType.findOne({
    where: {
      name,
    },
  });

  return data;
};

export const getWidgetTypeById = async (id: number): Promise<WidgetTypeOutput | null> => {
  const data = await WidgetType.findByPk(id);

  return data;
};

export const getAllWidgetTypeListDAL = async (): Promise<WidgetTypeOutput[]> => {
  const data = await WidgetType.findAll({
    attributes: ['id', 'name'],
  });
  return data;
};
