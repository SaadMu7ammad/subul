import {
  ICaseDocument,
  ICase,
  FilterObj,
} from './interfaces/case.interface';
import CaseModel from './models/case.model';
import { CaseDao } from './interfaces/case.dao';

export class CaseRepository implements CaseDao {
  createCase = async (caseData: ICase): Promise<ICaseDocument | null> => {
    const newCase = (await CaseModel.create(caseData)) as ICaseDocument | null;
    return newCase;
  };

  getAllCases = async (
    sortObj,//it need fix or a discussion XXXXXXX
    filterObj: FilterObj,
    page: number,
    limit: number
  ): Promise<ICaseDocument[] | null> => {
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
        freezed: 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
      });

    return charityCases;
  };

  getCaseById = async (id: string): Promise<ICaseDocument | null> => {
    const _case = (await CaseModel.findById(id)) as ICaseDocument | null;
    return _case;
  };

  deleteCaseById = async (id: string): Promise<ICaseDocument | null> => {
    const _case = (await CaseModel.findByIdAndDelete(
      id
    )) as ICaseDocument | null;
    return _case;
  };

  editCase = async (
    caseData: ICase,
    id: string
  ): Promise<ICaseDocument | null> => {
    const updatedCase = (await CaseModel.findByIdAndUpdate(
      id,
      {
        $set: { ...caseData },
      },
      {
        new: true,
        runValidators: true,
      }
    )) as ICaseDocument | null;

    return updatedCase;
  };
}
