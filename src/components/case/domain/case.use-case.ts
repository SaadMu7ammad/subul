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

    const responseData = await this.caseServiceInstance.addCase(caseData, caseImage, charity);

    return {
      case: responseData.case,
      message: 'Case Created Successfully',
    };
  }

  async getAllCases(req: Request, res: Response, next: NextFunction): Promise<GetAllCasesResponse> {
    const queryParams: GetAllCasesQueryParams = req.query;
    const charityId: string = res.locals.charity._id;

    const responseData = await this.caseServiceInstance.getAllCases(charityId, queryParams);

    return {
      cases: responseData.cases,
      message: 'All Cases fetched Successfully',
    };
  }

  async getAllCasesForUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<{ cases: ICase[]; message: string }> {
    const queryParams: GetAllCasesQueryParams = req.query;

    const responseData = await this.caseServiceInstance.getAllCasesForUser(res, queryParams);

    return {
      cases: responseData.cases,
      message: 'All Cases fetched Successfully',
    };
  }

  async getCaseById(req: Request, res: Response, next: NextFunction): Promise<GetCaseByIdResponse> {
    const charityCases: ICase['id'][] = res.locals.charity.cases;
    const caseId: string | undefined = req.params.caseId;
    if (!caseId) throw new NotFoundError('no id exist for the case');

    const responseData = await this.caseServiceInstance.getCaseById(charityCases, caseId);

    return {
      case: responseData.case,
      message: 'Case Fetched Successfully',
    };
  }

  async deleteCase(req: Request, res: Response, next: NextFunction): Promise<DeleteCaseResponse> {
    const charity = res.locals.charity;

    const caseId: string | undefined = req.params.caseId;
    if (!caseId) throw new NotFoundError('no id exist for the case');

    const responseData = await this.caseServiceInstance.deleteCase(charity, caseId);

    return {
      case: responseData.case,
      message: 'Case Deleted Successfully',
    };
  }

  async editCase(req: Request, res: Response, next: NextFunction): Promise<EditCaseResponse> {
    const charity = res.locals.charity;

    const caseId: string | undefined = req.params.caseId;
    if (!caseId) throw new NotFoundError('no id exist for the case');
    const caseData: ICase & { coverImage: string; image: string[] } = req.body;

    const responseData = await this.caseServiceInstance.editCase(charity, caseData, caseId);

    return {
      case: responseData.case,
      message: 'Case Edited Successfully',
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
