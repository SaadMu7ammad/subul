import {
  FilterObj,
  GetAllCasesQueryParams,
  ICase,
  PaginationObj,
  SortObj,
  caseUtilsSkeleton,
} from '@components/case/data-access/interfaces';
import { ICharity } from '@components/charity/data-access/interfaces';
import { NotFoundError } from '@libs/errors/components/not-found';
import { deleteOldImgs } from '@utils/deleteFile';
// import { Response } from 'express';
import { Request } from 'express';

import { CASE } from './case.class';

export class caseUtilsClass implements caseUtilsSkeleton {
  caseInstance: CASE;
  constructor() {
    this.caseInstance = new CASE();
  }

  async createCase(charity: ICharity, caseData: ICase): Promise<ICase | null> {
    return await this.caseInstance.caseModel.createCase(charity, caseData);
  }

  getSortObj(sortQueryParams: string | undefined): SortObj {
    const sortBy: string = sortQueryParams || 'upVotes';

    const sortArray: string[] = sortBy.split(',');

    const sortObj: SortObj = {};
    sortArray.forEach(function (sort) {
      if (sort[0] === '-') {
        sortObj[sort.substring(1)] = -1;
      } else {
        sortObj[`${sort}`] = 1;
      }
    });

    return sortObj;
  }

  getFilterObj(charityId: string | undefined, queryParams: GetAllCasesQueryParams): FilterObj {
    let filterObject: FilterObj;

    if (charityId)
      filterObject = { charity: charityId }; //if the req is from charity itself ONLY
    else filterObject = {};
    //each element of the array should be a key of the GetAllCasesQueryParams type.
    const filterQueryParameters: (keyof GetAllCasesQueryParams)[] = [
      'mainType',
      'subType',
      'nestedSubType',
      'freezed',
    ];
    // filterQueryParameters[0]='mainType'//just for remove the code temp
    for (const param of filterQueryParameters) {
      if (queryParams[`${param}`]) {
        if (param === 'freezed') {
          // console.log(typeof queryParams[param]);//string
          filterObject[`${param}`] = true; // queryParams[param];
          filterObject['mainType'] = 'customizedCampaigns';

          // console.log(typeof filterObject[param]);//string if we assign queryParams[param] not explicit value
        } else if (param == 'mainType' || param == 'subType' || param == 'nestedSubType') {
          filterObject[`${param}`] = queryParams[`${param}`];
        }
      }
    }

    return filterObject;
  }

  getCasesPagination(queryParams: GetAllCasesQueryParams): PaginationObj {
    const limit = queryParams?.limit ? +queryParams.limit : 10;

    const page = queryParams?.page ? +queryParams.page : 1;

    return { limit, page };
  }

  async getAllCases(
    sortObj: SortObj,
    filterObj: FilterObj,
    page: number,
    limit: number
  ): Promise<ICase[] | null> {
    const cases: ICase[] | null = await this.caseInstance.caseModel.getAllCases(
      sortObj,
      filterObj,
      page,
      limit
    );

    return cases;
  }
  sortCases(allCases: ICase[]): ICase[] {
    allCases.sort((a, b) => {
      if (!a.finished && b.finished) {
        return -1; // a comes before b
      } else if (a.finished && !b.finished) {
        return 1; // b comes before a
      } else {
        return 0; // no change in order
      }
    });
    return allCases;
  }
  // async getAllCasesForUser(
  //   res: Response,
  //   sortObj: SortObj,
  //   page: number,
  //   limit: number
  // ): Promise<ICase[] | null> {
  //   const cases = await this.caseInstance.caseModel.getAllCasesForUser(res, sortObj, page, limit);

  //   return cases;
  // }

  async getCaseByIdFromDB(req: Request, caseId: string): Promise<ICase> {
    const _case: ICase | null = await this.caseInstance.caseModel.getCaseById(caseId);

    if (!_case) throw new NotFoundError(req.t('errors.caseNotFound'));

    return _case;
  }

  checkIfCaseBelongsToCharity(
    req: Request,
    charityCasesArray: ICase['_id'][],
    caseId: string
  ): number {
    const idx: number = charityCasesArray.findIndex(function (id) {
      return id.toString() === caseId;
    });

    if (idx === -1) {
      throw new NotFoundError(req.t('errors.caseNotFound'));
    }

    return idx;
  }

  async deleteCaseFromDB(req: Request, id: string): Promise<ICase> {
    const deletedCase: ICase | null = await this.caseInstance.caseModel.deleteCaseById(id);

    if (!deletedCase) {
      throw new NotFoundError('No Such Case With this Id!');
    }

    deleteOldImgs('caseCoverImages', deletedCase.coverImage);

    return deletedCase;
  }

  async deleteCaseFromCharityCasesArray(charity: ICharity, idx: number): Promise<void> {
    const caseIdsArray = charity.cases;

    caseIdsArray.splice(idx, 1);

    charity.cases = caseIdsArray;

    await charity.save();
  }

  async editCase(caseData: ICase, caseId: string): Promise<ICase> {
    let updatedCase: ICase | null;
    // const temp = {
    //   finished: caseData?.finished || false
    // }
    if (caseData?.finished?.toString() === 'true') {
      //Only make it finished manually and dont change anything else
      updatedCase = await this.caseInstance.caseModel.editCase({ finished: true }, caseId);
      if (!updatedCase) throw new NotFoundError('No Such Case With this Id!');

      return updatedCase;
    }
    updatedCase = await this.caseInstance.caseModel.editCase(caseData, caseId);

    if (!updatedCase) throw new NotFoundError('No Such Case With this Id!');

    return updatedCase;
  }

  async replaceCaseImg(
    caseData: { coverImage: string; image: string[] },
    caseId: string
  ): Promise<() => void> {
    if (caseData.image[0]) caseData.coverImage = caseData.image[0];

    const caseObject: ICase | null = await this.caseInstance.caseModel.getCaseById(caseId);

    if (!caseObject) throw new NotFoundError('No Such Case With this Id!');

    const oldCoverImage: string = caseObject.coverImage;

    return deleteOldImgs.bind(this, 'caseCoverImages', oldCoverImage);
  }
}
// export const caseUtils = {
//   createCase,
//   getSortObj,
//   getFilterObj,
//   getCasesPagination,
//   getAllCases,
//   getCaseByIdFromDB,
//   checkIfCaseBelongsToCharity,
//   deleteCaseFromCharityCasesArray,
//   deleteCaseFromDB,
//   editCase,
//   replaceCaseImg,
//   getAllCasesForUser,
// };
