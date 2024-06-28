import { ICharity } from '@components/charity/data-access/interfaces';
import { IUser } from '@components/user/data-access/interfaces';
import { NextFunction, Request, Response } from 'express';

import {
  AddCaseResponse,
  DeleteCaseResponse,
  EditCaseResponse,
  GetAllCasesResponse,
  GetCaseByIdResponse,
} from './case.api';
import { FilterObj, GetAllCasesQueryParams, ICase, PaginationObj, SortObj } from './case.interface';

export interface CaseDao {
  createCase: (caseData: ICase) => Promise<ICase | null>;
  getAllCases: (
    sortObj: SortObj,
    filterObj: FilterObj,
    page: number,
    limit: number
  ) => Promise<ICase[] | null>;
  getCaseById: (id: string) => Promise<ICase | null>;
  deleteCaseById: (id: string) => Promise<ICase | null>;
  editCase: (caseData: ICase, id: string) => Promise<ICase | null>;
}

export interface caseServiceSkeleton {
  addCase(
    caseData: ICase,
    image: string,
    charity: ICharity,
    user: IUser | undefined
  ): Promise<AddCaseResponse>;

  getAllCases(charityId: string, queryParams: GetAllCasesQueryParams): Promise<GetAllCasesResponse>;

  getAllCasesForUser(
    res: Response,
    queryParams: GetAllCasesQueryParams
  ): Promise<GetAllCasesResponse>;

  getCaseById(charityCases: ICase['id'][], caseId: string): Promise<GetCaseByIdResponse>;

  deleteCase(charity: ICharity, caseId: string): Promise<DeleteCaseResponse>;

  editCase(
    charity: ICharity,
    caseData: ICase & { coverImage: string; image: string[] },
    caseId: string
  ): Promise<EditCaseResponse>;
}

export interface caseUseCaseSkeleton {
  addCase(req: Request, res: Response, next: NextFunction): Promise<AddCaseResponse>;

  getAllCases(req: Request, res: Response, next: NextFunction): Promise<GetAllCasesResponse>;
  getAllCasesForUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<{ cases: ICase[]; message: string }>;

  getCaseById(req: Request, res: Response, next: NextFunction): Promise<GetCaseByIdResponse>;

  deleteCase(req: Request, res: Response, next: NextFunction): Promise<DeleteCaseResponse>;

  editCase(req: Request, res: Response, next: NextFunction): Promise<EditCaseResponse>;
}

export interface caseUtilsSkeleton {
  createCase(caseData: ICase): Promise<ICase | null>;

  getSortObj(sortQueryParams: string | undefined): SortObj;

  getFilterObj(charityId: string, queryParams: GetAllCasesQueryParams): FilterObj;

  getCasesPagination(queryParams: GetAllCasesQueryParams): PaginationObj;
  getAllCases(
    sortObj: SortObj,
    filterObj: FilterObj,
    page: number,
    limit: number
  ): Promise<ICase[] | null>;

  getAllCasesForUser(
    res: Response,
    sortObj: SortObj,
    page: number,
    limit: number
  ): Promise<ICase[] | null>;
  getCaseByIdFromDB(caseId: string): Promise<ICase>;
  checkIfCaseBelongsToCharity(charityCasesArray: ICase['_id'][], caseId: string): number;

  deleteCaseFromDB(id: string): Promise<ICase>;
  deleteCaseFromCharityCasesArray(charity: ICharity, idx: number): Promise<void>;
  editCase(caseData: ICase, caseId: string): Promise<ICase>;
  replaceCaseImg(
    caseData: { coverImage: string; image: string[] },
    caseId: string
  ): Promise<() => void>;
}
