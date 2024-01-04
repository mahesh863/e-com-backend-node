import expressAsyncHandler from 'express-async-handler';
import { CompanyInput } from '../model/company.model';
import {
  createCompany,
  deleteCompanyById,
  getAllCompanyDAL,
  getAllPublicCompanyDAL,
  getCompanyByName,
  updateCompanyDAL,
  updateCompanyVisibility,
} from '../dal/company.dal';
import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import cloudinaryFileUploader from '../utils/cloudinaryFileUploader';
import CustomError from '../utils/customErrors';

interface VisibilityInterface {
  companyIds: number[];
  visibility: boolean;
}

export const createNewCompany = expressAsyncHandler(async (req: Request<{}, {}, CompanyInput>, res: Response) => {
  const newCompanyDetails = req.body;
  const companyLogo = req.files?.logo as UploadedFile;

  const companyDetails = await getCompanyByName(newCompanyDetails.name);

  if (companyDetails) {
    throw new CustomError('Company already exists', 400);
  }

  const uploadedLogo = await cloudinaryFileUploader({
    filePath: companyLogo.tempFilePath,
    folderName: 'company',
  });

  newCompanyDetails.image = uploadedLogo;

  await createCompany(newCompanyDetails);

  res.status(201).json({ message: 'Company created successfully' });
});

export const updateCompany = expressAsyncHandler(async (req: Request<{}, {}, Partial<CompanyInput>>, res: Response) => {
  const { id, ...otherData } = req.body;

  let companyLogo = req.files?.logo;

  if (companyLogo) {
    companyLogo = companyLogo as UploadedFile;
    const uploadedLogo = await cloudinaryFileUploader({
      filePath: companyLogo.tempFilePath,
      folderName: 'company',
    });
    otherData.image = uploadedLogo;
  }

  await updateCompanyDAL(id!, otherData);

  res.status(200).json({ message: 'Company updated successfully' });
});

export const deleteCompany = expressAsyncHandler(async (req: Request, res: Response) => {
  const { id } = req.query;
  await deleteCompanyById(Number(id));
  res.status(200).json({ message: 'Company deleted successfully' });
});

export const changeCompanyVisibility = expressAsyncHandler(async (req: Request<{}, {}, VisibilityInterface>, res: Response) => {
  const { companyIds, visibility } = req.body;
  await updateCompanyVisibility(companyIds, visibility);
  res.status(200).json({ message: 'Selected companies are marked as visible' });
});

export const getAllPublicCompany = expressAsyncHandler(async (req: Request, res: Response) => {
  const allCompanies = await getAllPublicCompanyDAL();

  const resData = {
    data: allCompanies,
  };

  res.status(200).json(resData);
});

export const getAllCompany = expressAsyncHandler(async (req: Request, res: Response) => {
  const allCompanies = await getAllCompanyDAL();

  const resData = {
    data: allCompanies,
  };

  res.status(200).json(resData);
});
