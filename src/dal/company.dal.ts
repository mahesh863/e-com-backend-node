import logger from '../logger/index.logger';
import Company, { CompanyInput, CompanyOutput } from '../model/company.model';
import CustomError from '../utils/customErrors';

export const createCompany = async (payload: CompanyInput): Promise<CompanyOutput> => {
  const company = await Company.create(payload);
  return company;
};

export const getCompanyByName = async (name: string): Promise<CompanyOutput | null> => {
  const company = await Company.findOne({ where: { name } });
  return company;
};

export const updateCompanyDAL = async (id: number, payload: Partial<CompanyInput>) => {
  try {
    await Company.update(payload, { where: { id } });
  } catch (error) {
    logger.error(error);
    throw new CustomError('Failed to update company', 500);
  }
};
export const deleteCompanyById = async (id: number) => {
  try {
    await Company.destroy({
      where: {
        id,
      },
    });
  } catch (error) {
    logger.error(error);
    throw new CustomError('Failed to delete company', 500);
  }
};

export const updateCompanyVisibility = async (id: number[], status: boolean) => {
  try {
    await Company.update({ isPublic: status }, { where: { id } });
  } catch (error) {
    logger.error(error);
    throw new CustomError('Failed to update company visibility', 500);
  }
};

export const getAllPublicCompanyDAL = async (): Promise<CompanyOutput[]> => {
  try {
    const allCategories = await Company.findAll({
      attributes: ['id', 'name', 'image'],

      where: {
        isPublic: true,
      },
    });

    return allCategories;
  } catch (error) {
    logger.error('failed to get all companies', error);
    throw new CustomError('Failed to get all companies', 500);
  }
};

export const getAllCompanyDAL = async (): Promise<CompanyOutput[]> => {
  try {
    const allCategories = await Company.findAll({
      attributes: ['id', 'name', 'image', 'isPublic'],
    });

    return allCategories;
  } catch (error) {
    logger.error('failed to get all companies', error);
    throw new CustomError('Failed to get all companies', 500);
  }
};
