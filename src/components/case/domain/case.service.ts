import {
  AddCaseResponse,
  DeleteCaseResponse,
  EditCaseResponse,
  FilterObj,
  GetAllCasesQueryParams,
  GetAllCasesResponse,
  GetCaseByIdResponse,
  ICase,
  PaginationObj,
  SortObj,
  caseServiceSkeleton,
} from '@components/case/data-access/interfaces';
import { ICharity } from '@components/charity/data-access/interfaces';
import { IUser } from '@components/user/data-access/interfaces';
import { USER } from '@components/user/domain/user.class';
import { userUtilsClass } from '@components/user/domain/user.utils';
import { BadRequestError, NotFoundError } from '@libs/errors/components';
import { setupMailSender } from '@utils/mailer';
import { notificationManager } from '@utils/sendNotification';
import { Request } from 'express';

import { caseUtilsClass } from './case.utils';

export class caseServiceClass implements caseServiceSkeleton {
  userUtilsInstance = new userUtilsClass();
  caseUtilsInstance = new caseUtilsClass();

  notificatioInstance = new notificationManager();
  async addCase(
    req: Request,
    caseData: ICase,
    image: string,
    charity: ICharity,
    user: IUser | undefined = undefined
  ): Promise<AddCaseResponse> {
    caseData.coverImage = image;
    caseData.charity = charity._id;
    const newCase: ICase | null = await this.caseUtilsInstance.createCase(charity, caseData);

    if (!newCase) throw new BadRequestError('case not created... try again');

    charity.cases.push(newCase._id);

    await charity.save();

    if (user) {
      user.contributions.push(newCase._id);
      await user.save();
    }

    await this.notificatioInstance.notifyAllUsers(
      // `Charity ${charity.name} has posted a new case , check it out!`,
      // req.t('notifications.charityPostedCase'),
      req.t('notifications.charityPostedCase', { name: charity.name }),
      1 * 24 * 60 * 60,
      'case',
      newCase._id
    );
    return { case: newCase };
  }

  getAllCases = async (
    charityId: string | undefined,
    queryParams: GetAllCasesQueryParams
  ): Promise<GetAllCasesResponse> => {
    const sortObj: SortObj = this.caseUtilsInstance.getSortObj(queryParams.sort);

    const filterObj: FilterObj = this.caseUtilsInstance.getFilterObj(charityId, queryParams);

    const { page, limit }: PaginationObj = this.caseUtilsInstance.getCasesPagination(queryParams);

    console.log(sortObj);
    console.log(filterObj);
    console.log(page, limit);
    const cases = await this.caseUtilsInstance.getAllCases(sortObj, filterObj, page, limit);

    if (!cases) throw new NotFoundError('no cases found');
    return { cases: cases };
  };

  // async getAllCasesForUser(
  //   res: Response,
  //   queryParams: GetAllCasesQueryParams
  // ): Promise<GetAllCasesResponse> {
  //   const sortObj: SortObj = this.caseUtilsInstance.getSortObj(queryParams.sort);

  //   const { page, limit }: PaginationObj = this.caseUtilsInstance.getCasesPagination(queryParams);

  //   const cases = await this.caseUtilsInstance.getAllCasesForUser(res, sortObj, page, limit);

  //   if (!cases) throw new NotFoundError('no cases found');
  //   return { cases: cases };
  // }

  async getCaseById(
    req: Request,
    charityCases: ICase['id'][],
    caseId: string
  ): Promise<GetCaseByIdResponse> {
    this.caseUtilsInstance.checkIfCaseBelongsToCharity(req, charityCases, caseId);

    const _case: ICase = await this.caseUtilsInstance.getCaseByIdFromDB(req, caseId);

    return {
      case: _case,
    };
  }

  async deleteCase(req: Request, charity: ICharity, caseId: string): Promise<DeleteCaseResponse> {
    const isCaseFinished = await this.caseUtilsInstance.getCaseByIdFromDB(req, caseId);
    if (isCaseFinished.finished)
      if (isCaseFinished.finished) throw new BadRequestError(req.t('errors.cantDeleteCase'));

    if (isCaseFinished.currentDonationAmount > 0)
      throw new BadRequestError(req.t('errors.cantDeleteCase'));

    const idx: number = this.caseUtilsInstance.checkIfCaseBelongsToCharity(
      req,
      charity.cases,
      caseId
    );

    const deletedCase: ICase = await this.caseUtilsInstance.deleteCaseFromDB(req, caseId);

    await this.caseUtilsInstance.deleteCaseFromCharityCasesArray(charity, idx);

    if (deletedCase.mainType === 'customizedCampaigns' && deletedCase.user) {
      //delete the id from the contributions arr of user and send email
      const user = new USER();

      const userOwner = await user.userModel.findUserById(deletedCase.user.toString());
      if (!userOwner) throw new BadRequestError('no user found');

      const idx = this.userUtilsInstance.checkIfCaseBelongsToUserContributions(
        userOwner.contributions,
        deletedCase._id.toString()
      );
      await this.userUtilsInstance.deleteCaseFromUserContributionsArray(userOwner, idx);

      await setupMailSender(
        userOwner.email,
        `Request Fundraising Campaign`,
        `hello ${userOwner.name.firstName} ${userOwner.name.lastName} -- we ${charity.name} charity are sorry that your fundraising request had been rejected`
      );
    }

    return {
      case: deletedCase,
    };
  }

  async editCase(
    req: Request,
    charity: ICharity,
    caseData: ICase & { coverImage: string; image: string[] },
    caseId: string
  ): Promise<EditCaseResponse> {
    const isFinishedCase = await this.caseUtilsInstance.getCaseByIdFromDB(req, caseId);
    if (isFinishedCase.finished) throw new BadRequestError(req.t('errors.cantEditCase'));

    this.caseUtilsInstance.checkIfCaseBelongsToCharity(req, charity.cases, caseId);

    let deleteOldImg: (() => void) | null = null;
    if (caseData.image) {
      deleteOldImg = await this.caseUtilsInstance.replaceCaseImg(caseData, caseId);
    }

    const updatedCase: ICase = await this.caseUtilsInstance.editCase(caseData, caseId);

    if (deleteOldImg) deleteOldImg();

    return {
      case: updatedCase,
    };
  }
}
// export const caseService = {
//   addCase,
//   getAllCases,
//   getCaseById,
//   deleteCase,
//   editCase,
//   getAllCasesForUser,
// };
