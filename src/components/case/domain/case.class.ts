import { ICharity } from '@components/charity/data-access/interfaces';
import { charityUtilsClass } from '@components/charity/domain/charity.utils';

import { CaseDao, FilterObj, ICase, SortObj } from '../data-access/interfaces';
import Case from '../data-access/models/case.model';
import { caseUtilsClass } from './case.utils';

// import Case from '../data-access/models/case.model';

class CaseRepository implements CaseDao {
  charityUtilsInstance: charityUtilsClass;

  constructor() {
    this.charityUtilsInstance = new charityUtilsClass();
  }
  async createCase(charity: ICharity, caseData: ICase): Promise<ICase | null> {
    const newCase = await Case.create(caseData);
    this.charityUtilsInstance.updateNumberOfCases(charity);
    await charity.save();

    return newCase;
  }

  async getAllCases(
    sortObj: SortObj,
    filterObj: FilterObj,
    page: number,
    limit: number
  ): Promise<ICase[] | null> {
    let charityCases = await Case.aggregate([
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
        privateNumber: 0,
        __v: 0,
      });
    const caseUtilsInstance = new caseUtilsClass();

    // charityCases.sort((a, b) => {
    //   if (!a.finished && b.finished) {
    //     return -1; // a comes before b
    //   } else if (a.finished && !b.finished) {
    //     return 1; // b comes before a
    //   } else {
    //     return 0; // no change in order
    //   }
    // });

    charityCases = caseUtilsInstance.sortCases(charityCases);
    return charityCases;
  }

  // async getAllCasesForUser(
  //   res: Response,
  //   sortObj: SortObj,
  //   page: number,
  //   limit: number
  // ): Promise<ICase[] | null> {
  //   let allCases = await Case.find()
  //     .sort(sortObj)
  //     .skip((page - 1) * limit)
  //     .limit(limit);

  //   if (res.locals.charity || (res.locals.user && !res.locals.user.isAdmin)) {
  //     // remove freezed cases
  //     allCases = allCases.filter(c => !c.freezed);
  //   }

  //   // make finished cases come last
  //   allCases.sort((a, b) => {
  //     if (!a.finished && b.finished) {
  //       return -1; // a comes before b
  //     } else if (a.finished && !b.finished) {
  //       return 1; // b comes before a
  //     } else {
  //       return 0; // no change in order
  //     }
  //   });

  //   return allCases;
  // }

  getCaseById = async (id: string): Promise<ICase | null> => {
    const _case = await Case.findById(id);
    return _case;
  };

  deleteCaseById = async (id: string): Promise<ICase | null> => {
    const _case = await Case.findByIdAndDelete(id);
    return _case;
  };

  editCase = async (caseData: ICase | { finished: boolean }, id: string): Promise<ICase | null> => {
    const updatedCase = await Case.findByIdAndUpdate(
      id,
      {
        $set: { ...caseData },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return updatedCase;
  };
}

export class CASE {
  public caseModel = new CaseRepository();

  constructor() {
    // super();
  }
}
