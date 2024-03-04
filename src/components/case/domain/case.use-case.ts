import { NextFunction,  Response } from 'express';

import { AuthedRequest } from '../../auth/user/data-access/auth.interface';
import {
  ICase,
  ICaseDocument,
  GetAllCasesQueryParams,
  ICaseDocumentResponse,
  ICasesDocumentResponse,
} from '../data-access/interfaces/case.interface';
import { caseService } from './case.service';
import { NotFoundError } from '../../../libraries/errors/components';

const addCase = async (
  req: AuthedRequest,
  res: Response,
  next: NextFunction
): Promise<ICaseDocumentResponse> => {
  const caseData: ICase = req.body;
  const caseImage: string = req.body.image[0];
  const charity = req.charity;

  const responseData = await caseService.addCase(caseData, caseImage, charity);

  return {
    case: responseData.case,
    message: 'Case Created Successfully',
  };
};

const getAllCases = async (
  req: AuthedRequest,
  res: Response,
  next: NextFunction
): Promise<ICasesDocumentResponse> => {
  const queryParams: GetAllCasesQueryParams = req.query;
  const charityId: string = req.charity._id;

  const responseData = await caseService.getAllCases(charityId, queryParams);

  return {
    cases: responseData.cases,
    message: 'All Cases fetched Successfully',
  };
};

const getCaseById = async (
  req: AuthedRequest,
  res: Response,
  next: NextFunction
): Promise<ICaseDocumentResponse> => {
  const charityCases: ICaseDocument[] = req.charity.cases;
  const caseId: string | undefined = req.params.caseId;
  if (!caseId) throw new NotFoundError('no id exist for the case');

  const responseData = await caseService.getCaseById(charityCases, caseId);

  return {
    case: responseData.case,
    message: 'Case Fetched Successfully',
  };
};

const deleteCase = async (
  req: AuthedRequest,
  res: Response,
  next: NextFunction
): Promise<ICaseDocumentResponse> => {
  const charity = req.charity;

  const caseId: string | undefined = req.params.caseId;
  if (!caseId) throw new NotFoundError('no id exist for the case');

  const responseData = await caseService.deleteCase(charity, caseId);

  return {
    case: responseData.case,
    message: 'Case Deleted Successfully',
  };
};

const editCase = async (
  req: AuthedRequest,
  res: Response,
  next: NextFunction
): Promise<ICaseDocumentResponse> => {
  const charity = req.charity;

  const caseId: string | undefined = req.params.caseId;
  if (!caseId) throw new NotFoundError('no id exist for the case');
  const caseData: ICase & { coverImage: string; image: string[] } = req.body;

  const responseData = await caseService.editCase(charity, caseData, caseId);

  return {
    case: responseData.case,
    message: 'Case Edited Successfully',
  };
};

export const caseUseCase = {
  addCase,
  getAllCases,
  getCaseById,
  deleteCase,
  editCase,
};
