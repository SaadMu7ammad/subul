import { caseUtils } from './case.utils';
import {
  ICase,
  ICaseDocument,
  FilterObj,
  GetAllCasesQueryParams,
  PaginationObj,
  SortObj,
  ICaseDocumentResponse,
  ICasesDocumentResponse,
} from '../data-access/interfaces/case.interface';
import {
  BadRequestError,
  NotFoundError,
} from '../../../libraries/errors/components';
import { ICharity } from '../../charity/data-access/interfaces/';
const addCase = async (
  caseData: ICase,
  image: string,
  charity: ICharity
): Promise<ICaseDocumentResponse> => {
  const newCase = await caseUtils.createCase({
    ...caseData,
    coverImage: image,
    charity: charity._id,
  });
  if (!newCase) throw new BadRequestError('case not created... try again');
  charity.cases.push(newCase._id);

  await charity.save();

  return { case: newCase };
};

const getAllCases = async (
  charityId: string,
  queryParams: GetAllCasesQueryParams
): Promise<ICasesDocumentResponse> => {
  const sortObj: SortObj = caseUtils.getSortObj(queryParams.sort);

  const filterObj: FilterObj = caseUtils.getFilterObj(charityId, queryParams);

  const { page, limit }: PaginationObj =
    caseUtils.getCasesPagination(queryParams);

  const cases = await caseUtils.getAllCases(sortObj, filterObj, page, limit);
  if (!cases) throw new NotFoundError('no cases found');
  return { cases: cases };
};

const getCaseById = async (
  charityCases: ICaseDocument[],
  caseId: string
): Promise<ICaseDocumentResponse> => {
  caseUtils.checkIfCaseBelongsToCharity(charityCases, caseId);

  const _case: ICaseDocument = await caseUtils.getCaseByIdFromDB(caseId);

  return {
    case: _case,
  };
};

const deleteCase = async (
  charity: ICharity,
  caseId: string
): Promise<ICaseDocumentResponse> => {
  const idx: number = caseUtils.checkIfCaseBelongsToCharity(
    charity.cases,
    caseId
  );

  const deletedCase: ICaseDocument = await caseUtils.deleteCaseFromDB(caseId);

  await caseUtils.deleteCaseFromCharityCasesArray(charity, idx);

  return {
    case: deletedCase,
  };
};

const editCase = async (
  charity: ICharity,
  caseData: ICase & { coverImage: string; image: string[] },
  caseId: string
): Promise<ICaseDocumentResponse> => {
  caseUtils.checkIfCaseBelongsToCharity(charity.cases, caseId);

  let deleteOldImg: (() => void) | null = null;
  if (caseData.image) {
    deleteOldImg = await caseUtils.replaceCaseImg(caseData, caseId);
  }

  let updatedCase: ICaseDocument = await caseUtils.editCase(caseData, caseId);

  if (deleteOldImg) deleteOldImg();

  return {
    case: updatedCase,
  };
};

export const caseService = {
  addCase,
  getAllCases,
  getCaseById,
  deleteCase,
  editCase,
};
