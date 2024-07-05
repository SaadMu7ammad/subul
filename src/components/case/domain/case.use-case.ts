import {
  AddCaseResponse,
  DeleteCaseResponse,
  EditCaseResponse,
  GetAllCasesQueryParams,
  GetAllCasesResponse,
  GetCaseByIdResponse,
  ICase,
  caseUseCaseSkeleton,
} from '@components/case/data-access/interfaces';
import { ICharity } from '@components/charity/data-access/interfaces';
import { NotFoundError } from '@libs/errors/components';
import { NextFunction, Request, Response } from 'express';

import { caseServiceClass } from './case.service';

export class caseUseCaseClass implements caseUseCaseSkeleton {
  caseServiceInstance: caseServiceClass;
  constructor() {
    this.caseServiceInstance = new caseServiceClass();
  }
  async addCase(req: Request, res: Response, next: NextFunction): Promise<AddCaseResponse> {
    const caseData: ICase = req.body;
    const caseImage: string = req.body?.image?.[0] || 'noImg';
    const charity: ICharity = res.locals.charity;

    const responseData = await this.caseServiceInstance.addCase(req, caseData, caseImage, charity);

    return {
      case: responseData.case,
      message: req.t('errors.caseAddedSuccessfully'),
    };
  }

  async getAllCases(req: Request, res: Response, next: NextFunction): Promise<GetAllCasesResponse> {
    const queryParams: GetAllCasesQueryParams = req.query;
    const charityId: string | undefined = res.locals?.charity?._id
      ? res.locals.charity._id
      : undefined;

    const responseData = await this.caseServiceInstance.getAllCases(charityId, queryParams);

    return {
      cases: responseData.cases,
      message: req.t('errors.fetchedCases'),
    };
  }

  // async getAllCasesForUser(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<{ cases: ICase[]; message: string }> {
  //   const queryParams: GetAllCasesQueryParams = req.query;

  //   const responseData = await this.caseServiceInstance.getAllCasesForUser(res, queryParams);

  //   return {
  //     cases: responseData.cases,
  //     message: req.t('errors.fetchAllCases'),
  //   };
  // }

  async getCaseById(req: Request, res: Response, next: NextFunction): Promise<GetCaseByIdResponse> {
    const charityCases: ICase['id'][] = res.locals.charity.cases;
    const caseId: string | undefined = req.params.caseId;
    if (!caseId) throw new NotFoundError('no id exist for the case');

    const responseData = await this.caseServiceInstance.getCaseById(req, charityCases, caseId);

    return {
      case: responseData.case,
      message: req.t('errors.fetchCase'),
    };
  }

  async deleteCase(req: Request, res: Response, next: NextFunction): Promise<DeleteCaseResponse> {
    const charity = res.locals.charity;

    const caseId: string | undefined = req.params.caseId;
    if (!caseId) throw new NotFoundError('no id exist for the case');

    const responseData = await this.caseServiceInstance.deleteCase(req, charity, caseId);

    return {
      case: responseData.case,
      message: req.t('errors.deleteCase'),
    };
  }

  async editCase(req: Request, res: Response, next: NextFunction): Promise<EditCaseResponse> {
    const charity = res.locals.charity;

    const caseId: string | undefined = req.params.caseId;
    if (!caseId) throw new NotFoundError('no id exist for the case');
    const caseData: ICase & { coverImage: string; image: string[] } = req.body;

    const responseData = await this.caseServiceInstance.editCase(req, charity, caseData, caseId);

    return {
      case: responseData.case,
      message: req.t('errors.editCase'),
    };
  }
}
// export const caseUseCase = {
//   addCase,
//   getAllCases,
//   getCaseById,
//   deleteCase,
//   editCase,
//   getAllCasesForUser,
// };
