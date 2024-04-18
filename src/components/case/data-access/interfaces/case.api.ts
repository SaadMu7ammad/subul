import { ICase } from './';

export interface ICaseDocumentResponse {
  case: ICase;
  message?: string;
}
export interface ICasesDocumentResponse {
  cases: ICase[];
  message?: string;
}
