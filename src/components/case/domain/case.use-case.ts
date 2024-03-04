import {
  ICase,
  ICaseDocument,
  GetAllCasesQueryParams,
  ICaseDocumentResponse,
  ICasesDocumentResponse,
} from '../data-access/interfaces/case.interface';
import { caseService } from './case.service';

const addCase = async (req, res, next): Promise<ICaseDocumentResponse> => {
  const caseData: ICase = req.body;
  const caseImage: string = req.body.image[0];
  const charity = req.charity;

  const responseData = await caseService.addCase(caseData, caseImage, charity);

  return {
    case: responseData.case,
    message: 'Case Created Successfully',
  };
};

const getAllCases = async (req, res, next): Promise<ICasesDocumentResponse> => {
  const queryParams: GetAllCasesQueryParams = req.query;
  const charityId: string = req.charity._id;

  const responseData = await caseService.getAllCases(charityId, queryParams);

  return {
    cases: responseData.cases,
    message: 'All Cases fetched Successfully',
  };
};

const getCaseById = async (req, res, next): Promise<ICaseDocumentResponse> => {
  const charityCases: ICaseDocument[] = req.charity.cases;
  const caseId: string = req.params.caseId;

  const responseData = await caseService.getCaseById(charityCases, caseId);

  return {
    case: responseData.case,
    message: 'Case Fetched Successfully',
  };
};

const deleteCase = async (req, res, next): Promise<ICaseDocumentResponse> => {
  const charity = req.charity;

  const caseId: string = req.params.caseId;

  const responseData = await caseService.deleteCase(charity, caseId);

  return {
    case: responseData.case,
    message: 'Case Deleted Successfully',
  };
};

const editCase = async (req, res, next): Promise<ICaseDocumentResponse> => {
  const charity = req.charity;

  const caseId: string = req.params.caseId;

  const caseData: ICase & { image: string } = req.body;

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
