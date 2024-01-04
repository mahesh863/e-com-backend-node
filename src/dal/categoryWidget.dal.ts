import CategoryWidget, { CategoryWidgetInput } from '../model/categoryWidget.model';
import Collection from '../model/collection.model';
import Product from '../model/product.model';

export const createNewCategoryWidgetDAL = async (newWidgetData: CategoryWidgetInput) => {
  await CategoryWidget.create(newWidgetData);
};

export const updateCategoryWidgetDAL = async (updateData: Partial<CategoryWidgetInput>, id: number): Promise<boolean> => {
  const updateCount = await CategoryWidget.update(updateData, { where: { id } });
  return !!updateCount;
};

export const deleteCategoryWidgetDAL = async (id: number): Promise<boolean> => {
  const deleteCount = await CategoryWidget.destroy({ where: { id } });
  return !!deleteCount;
};

export const getAllCategoryWidgetDataDAL = async (): Promise<CategoryWidget[]> => {
  const allData = await CategoryWidget.findAll({
    include: [
      {
        model: Collection,
        as: 'collectionData',
      },
      {
        model: Product,
        as: 'productData',
      },
    ],
  });
  return allData;
};

export const getAllCategoryWidgetDataByIdDAL = async (id: number): Promise<CategoryWidget | null> => {
  const allData = await CategoryWidget.findOne({
    where: {
      id,
    },
  });
  return allData;
};
