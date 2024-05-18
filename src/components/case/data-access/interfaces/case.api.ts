import { ICase } from './';

export interface AddCaseResponse {
  case: ICase;
  message?: string;
}

export interface GetAllCasesResponse {
  cases: ICase[];
  message?: string;
}

export interface GetCaseByIdResponse {
  case: ICase;
  message?: string;
}

export interface DeleteCaseResponse {
  case: ICase;
  message?: string;
}

export interface EditCaseResponse {
  case: ICase;
  message?: string;
}
