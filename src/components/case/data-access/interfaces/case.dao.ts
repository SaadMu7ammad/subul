import { ICharity } from '@components/charity/data-access/interfaces';

import { FilterObj, ICase, SortObj } from './case.interface';

export interface CaseDao {
  createCase: (charity: ICharity, caseData: ICase) => Promise<ICase | null>;
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
