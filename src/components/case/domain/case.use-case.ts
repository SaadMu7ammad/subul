import { NextFunction, Response, Request } from 'express';

import {
  ICase,
  GetAllCasesQueryParams,
  AddCaseResponse,
  GetAllCasesResponse,
  GetCaseByIdResponse,
  EditCaseResponse,
  DeleteCaseResponse,
} from '../data-access/interfaces/';
import { caseService } from './case.service';
import { NotFoundError } from '../../../libraries/errors/components';
import { ICharity } from '../../charity/data-access/interfaces';

const addCase = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<AddCaseResponse> => {
  const caseData: ICase = req.body;
  const caseImage: string = req.body?.image?.[0] || 'noImg';
  const charity: ICharity = res.locals.charity;

  const responseData = await caseService.addCase(caseData, caseImage, charity);

  return {
    case: responseData.case,
    message: 'Case Created Successfully',
  };
};

const getAllCases = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<GetAllCasesResponse> => {
  const queryParams: GetAllCasesQueryParams = req.query;
  const charityId: string = res.locals.charity._id;

  const responseData = await caseService.getAllCases(charityId, queryParams);

  return {
    cases: responseData.cases,
    message: 'All Cases fetched Successfully',
  };
};

const getAllCasesForUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const queryParams: GetAllCasesQueryParams = req.query;

  const responseData = await caseService.getAllCasesForUser(queryParams);

  return {
    cases: responseData.cases,
    message: 'All Cases fetched Successfully',
  };
};

const getCaseById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<GetCaseByIdResponse> => {
  const charityCases: ICase['id'][] = res.locals.charity.cases;
  const caseId: string | undefined = req.params.caseId;
  if (!caseId) throw new NotFoundError('no id exist for the case');

  const responseData = await caseService.getCaseById(charityCases, caseId);

  return {
    case: responseData.case,
    message: 'Case Fetched Successfully',
  };
};

const deleteCase = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<DeleteCaseResponse> => {
  const charity = res.locals.charity;

  const caseId: string | undefined = req.params.caseId;
  if (!caseId) throw new NotFoundError('no id exist for the case');

  const responseData = await caseService.deleteCase(charity, caseId);

  return {
    case: responseData.case,
    message: 'Case Deleted Successfully',
  };
};

const editCase = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<EditCaseResponse> => {
  const charity = res.locals.charity;

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
  getAllCasesForUser,
};
