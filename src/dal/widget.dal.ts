import Widget, { WidgetInput, WidgetOutput } from '../model/widget.model';
import WidgetType from '../model/widgetType.model';

export const createNewWidgetDAL = async (data: WidgetInput) => {
  await Widget.create(data);
};

export const getAllWidgetDAL = async (): Promise<WidgetOutput[]> => {
  const allWidgetData = await Widget.findAll({
    attributes: ['id', 'widgetData', 'name'],
    include: [
      {
        model: WidgetType,
        attributes: ['id', 'name'],
      },
    ],
  });
  return allWidgetData;
};

export const getAllWidgetDataDAL = async (id: number): Promise<WidgetOutput | null> => {
  const allWidgetData = await Widget.findOne({
    attributes: ['widgetData'],
    where: {
      id,
    },
  });
  return allWidgetData;
};
