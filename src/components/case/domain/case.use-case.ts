import {
  AddCaseResponse,
  DeleteCaseResponse,
  EditCaseResponse,
  GetAllCasesQueryParams,
  GetAllCasesResponse,
  GetCaseByIdResponse,
  ICase,
} from '@components/case/data-access/interfaces';
import { ICharity } from '@components/charity/data-access/interfaces';
import { NotFoundError } from '@libs/errors/components';
import { NextFunction, Request, Response } from 'express';

import { caseService } from './case.service';

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
    message: req.t('errors.caseAddedSuccessfully'),
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
    message: req.t('errors.fetchedCases'),
  };
};

const getAllCasesForUser = async (req: Request, res: Response, next: NextFunction) => {
  const queryParams: GetAllCasesQueryParams = req.query;

  const responseData = await caseService.getAllCasesForUser(res, queryParams);

  return {
    cases: responseData.cases,
    message: req.t('errors.fetchAllCases'),
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

  const responseData = await caseService.getCaseById(req, charityCases, caseId);

  return {
    case: responseData.case,
    message: req.t('errors.fetchCase'),
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

  const responseData = await caseService.deleteCase(req, charity, caseId);

  return {
    case: responseData.case,
    message: req.t('errors.deleteCase'),
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

  const responseData = await caseService.editCase(req, charity, caseData, caseId);

  return {
    case: responseData.case,
    message: req.t('errors.editCase'),
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
