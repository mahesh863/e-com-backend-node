import Collection, { CollectionInput, CollectionOutput } from '../model/collection.model';
import Product from '../model/product.model';

export const getCollectionByName = async (name: string): Promise<CollectionOutput | null> => {
  const collectionData = await Collection.findOne({
    where: {
      name,
    },
  });

  return collectionData;
};

export const createCollectionDal = async ({ name, bannerImage }: CollectionInput): Promise<CollectionOutput> => {
  const collectionData = await Collection.create({
    name,
    bannerImage,
  });

  return collectionData;
};

export const getAllCollectionDal = async (): Promise<CollectionOutput[]> => {
  const collectionData = await Collection.findAll({
    attributes: ['id', 'name'],
  });
  return collectionData;
};

export const getCollectionDataByIdDal = async (id: number): Promise<CollectionOutput | null> => {
  const collectionData = await Collection.findByPk(id);
  return collectionData;
};
export const getAllCollectionDetailsDal = async (id: number): Promise<CollectionOutput | null> => {
  const collectionData = await Collection.findOne({
    attributes: ['id', 'name', 'bannerImage'],
    where: {
      id,
    },
    include: [
      {
        model: Product,
        attributes: ['id'],
        through: { attributes: [] },
      },
    ],
  });

  return collectionData;
};
