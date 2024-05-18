import { NotFoundError } from '../../../libraries/errors/components/not-found';
import { deleteOldImgs } from '../../../utils/deleteFile';
import { ICharity } from '../../charity/data-access/interfaces/';
import { CaseRepository } from '../data-access/case.repository';
import {
  FilterObj,
  GetAllCasesQueryParams,
  SortObj,
  ICase,
  PaginationObj,
} from '../data-access/interfaces';

const caseRepository = new CaseRepository();

const createCase = async (caseData: ICase) => {
  return await caseRepository.createCase(caseData);
};

const getSortObj = (sortQueryParams: string | undefined): SortObj => {
  const sortBy: string = sortQueryParams || 'upVotes';

  const sortArray: string[] = sortBy.split(',');

  const sortObj: SortObj = {};
  sortArray.forEach(function (sort) {
    if (sort[0] === '-') {
      sortObj[sort.substring(1)] = -1;
    } else {
      sortObj[sort] = 1;
    }
  });

  return sortObj;
};

const getFilterObj = (
  charityId: string,
  queryParams: GetAllCasesQueryParams
): FilterObj => {
  const filterObject: FilterObj = { charity: charityId };
  //each element of the array should be a key of the GetAllCasesQueryParams type.
  const filterQueryParameters: (keyof GetAllCasesQueryParams)[] = [
    'mainType',
    'subType',
    'nestedSubType',
    'freezed',
  ];
  // filterQueryParameters[0]='mainType'//just for remove the code temp
  for (const param of filterQueryParameters) {
    if (queryParams[param]) {
      if (param === 'freezed') {
        // console.log(typeof queryParams[param]);//string
        filterObject[param] = true; // queryParams[param];
        filterObject['mainType'] = 'customizedCampaigns';

        // console.log(typeof filterObject[param]);//string if we assign queryParams[param] not explicit value
      } else if (
        param == 'mainType' ||
        param == 'subType' ||
        param == 'nestedSubType'
      ) {
        filterObject[param] = queryParams[param];
      }
    }
  }

  return filterObject;
};

const getCasesPagination = (
  queryParams: GetAllCasesQueryParams
): PaginationObj => {
  const limit = queryParams?.limit ? +queryParams.limit : 10;

  const page = queryParams?.page ? +queryParams.page : 1;

  return { limit, page };
};

const getAllCases = async (
  sortObj: SortObj,
  filterObj: FilterObj,
  page: number,
  limit: number
) => {
  const cases: ICase[] | null = await caseRepository.getAllCases(
    sortObj,
    filterObj,
    page,
    limit
  );

  return cases;
};

const getAllCasesForUser = async (
  sortObj: SortObj,
  page: number,
  limit: number
): Promise<ICase[] | null> => {
  const cases = await caseRepository.getAllCasesForUser(sortObj, page, limit);

  return cases;
};

const getCaseByIdFromDB = async (caseId: string): Promise<ICase> => {
  const _case: ICase | null = await caseRepository.getCaseById(caseId);

  if (!_case) throw new NotFoundError('No Such Case With this Id!');

  return _case;
};

const checkIfCaseBelongsToCharity = (
  charityCasesArray: ICase['_id'][],
  caseId: string
): number => {
  const idx: number = charityCasesArray.findIndex(function (id) {
    return id.toString() === caseId;
  });

  if (idx === -1) {
    throw new NotFoundError('No Such Case With this Id!');
  }

  return idx;
};

const deleteCaseFromDB = async (id: string) => {
  const deletedCase: ICase | null = await caseRepository.deleteCaseById(id);

  if (!deletedCase) {
    throw new NotFoundError('No Such Case With this Id!');
  }

  deleteOldImgs('caseCoverImages', deletedCase.coverImage);

  return deletedCase;
};

const deleteCaseFromCharityCasesArray = async (
  charity: ICharity,
  idx: number
) => {
  const caseIdsArray = charity.cases;

  caseIdsArray.splice(idx, 1);

  charity.cases = caseIdsArray;

  await charity.save();
};

const editCase = async (caseData: ICase, caseId: string) => {
  let updatedCase: ICase | null;
  // const temp = {
  //   finished: caseData?.finished || false
  // }
  if (caseData?.finished?.toString() === 'true') {
    //Only make it finished manually and dont change anything else
    updatedCase = await caseRepository.editCase({ finished: true }, caseId);
    if (!updatedCase) throw new NotFoundError('No Such Case With this Id!');

    return updatedCase;
  }
  updatedCase = await caseRepository.editCase(caseData, caseId);

  if (!updatedCase) throw new NotFoundError('No Such Case With this Id!');

  return updatedCase;
};

const replaceCaseImg = async (
  caseData: { coverImage: string; image: string[] },
  caseId: string
) => {
  if (caseData.image[0]) caseData.coverImage = caseData.image[0];

  const caseObject: ICase | null = await caseRepository.getCaseById(caseId);

  if (!caseObject) throw new NotFoundError('No Such Case With this Id!');

  let oldCoverImage: string = caseObject.coverImage;

  return deleteOldImgs.bind(this, 'caseCoverImages', oldCoverImage);
};

export const caseUtils = {
  createCase,
  getSortObj,
  getFilterObj,
  getCasesPagination,
  getAllCases,
  getCaseByIdFromDB,
  checkIfCaseBelongsToCharity,
  deleteCaseFromCharityCasesArray,
  deleteCaseFromDB,
  editCase,
  replaceCaseImg,
  getAllCasesForUser,
};
