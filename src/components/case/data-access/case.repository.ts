import {
  ICase,
  FilterObj,
  SortObj,
} from './interfaces/case.interface';
import CaseModel from './models/case.model';
import { CaseDao } from './interfaces/case.dao';

export class CaseRepository implements CaseDao {
  createCase = async (caseData: ICase): Promise<ICase| null> => {
    const newCase = (await CaseModel.create(caseData));
    return newCase;
  };

  getAllCases = async (
    sortObj:SortObj,
    filterObj: FilterObj,
    page: number,
    limit: number
  ): Promise<ICase[] | null> => {
    const charityCases = await CaseModel.aggregate([
      {
        $match: filterObj,
      },
      {
          $sort: sortObj,
      },
    ])
      .skip((page - 1) * limit)
      .limit(limit)
      .project({
        gender: 0,
        upVotes: 0,
        views: 0,
        dateFinished: 0,
        donationNumbers: 0,
        helpedNumbers: 0,
        // freezed: ,
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
      });

    return charityCases;
  };

  getCaseById = async (id: string): Promise<ICase| null> => {
    const _case = (await CaseModel.findById(id));
    return _case;
  };

  deleteCaseById = async (id: string): Promise<ICase| null> => {
    const _case = (await CaseModel.findByIdAndDelete(
      id
    ));
    return _case;
  };

  editCase = async (
    caseData: ICase | { finished: boolean },
    id: string
  ): Promise<ICase | null> => {
    const updatedCase = (await CaseModel.findByIdAndUpdate(
      id,
      {
        $set: { ...caseData },
      },
      {
        new: true,
        runValidators: true,
      }
    ));

    return updatedCase;
  };
}
