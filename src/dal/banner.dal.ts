import Banner, { BannerInput, BannerOutput } from '../model/banner.model';

export const createNewBannerDAL = async (banner: BannerInput) => {
  await Banner.create(banner);
};

export const updateBannerDAL = async (updateData: Partial<BannerInput>, bannerId: number): Promise<boolean> => {
  const affectedCounts = await Banner.update(updateData, {
    where: {
      id: bannerId,
    },
  });

  return !!affectedCounts;
};

export const getBannerListDetailsDAL = async (): Promise<BannerOutput[]> => {
  const data = await Banner.findAll({
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },
  });

  return data;
};

export const getBannerDetailsByIdDAL = async (id: number): Promise<BannerOutput | null> => {
  const data = await Banner.findOne({
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'deletedAt'],
    },
    where: {
      id,
    },
  });

  return data;
};
