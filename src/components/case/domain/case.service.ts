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
} from '@components/case/data-access/interfaces';
import { ICharity } from '@components/charity/data-access/interfaces';
import { IUser } from '@components/user/data-access/interfaces';
import { USER } from '@components/user/domain/user.class';
import { userUtilsClass } from '@components/user/domain/user.utils';
import { BadRequestError, NotFoundError } from '@libs/errors/components';
import { setupMailSender } from '@utils/mailer';
import { notificationManager } from '@utils/sendNotification';
import { Request } from 'express';
import { Response } from 'express';

import { caseUtils } from './case.utils';

const userUtilsInstance = new userUtilsClass();

const notificatioInstance = new notificationManager();
const addCase = async (
  caseData: ICase,
  image: string,
  charity: ICharity,
  user: IUser | undefined = undefined
): Promise<AddCaseResponse> => {
  caseData.coverImage = image;
  caseData.charity = charity._id;
  const newCase: ICase | null = await caseUtils.createCase(charity, caseData);

  if (!newCase) throw new BadRequestError('case not created... try again');

  charity.cases.push(newCase._id);

  await charity.save();

  if (user) {
    user.contributions.push(newCase._id);
    await user.save();
  }

  notificatioInstance.notifyAllUsers(
    `Charity ${charity.name} has posted a new case , check it out!`,
    1 * 24 * 60 * 60,
    'case',
    newCase._id
  );
  return { case: newCase };
};

const getAllCases = async (
  charityId: string,
  queryParams: GetAllCasesQueryParams
): Promise<GetAllCasesResponse> => {
  const sortObj: SortObj = caseUtils.getSortObj(queryParams.sort);

  const filterObj: FilterObj = caseUtils.getFilterObj(charityId, queryParams);

  const { page, limit }: PaginationObj = caseUtils.getCasesPagination(queryParams);

  const cases = await caseUtils.getAllCases(sortObj, filterObj, page, limit);

  if (!cases) throw new NotFoundError('no cases found');
  return { cases: cases };
};

const getAllCasesForUser = async (
  res: Response,
  queryParams: GetAllCasesQueryParams
): Promise<GetAllCasesResponse> => {
  const sortObj: SortObj = caseUtils.getSortObj(queryParams.sort);

  const { page, limit }: PaginationObj = caseUtils.getCasesPagination(queryParams);

  const cases = await caseUtils.getAllCasesForUser(res, sortObj, page, limit);

  if (!cases) throw new NotFoundError('no cases found');
  return { cases: cases };
};

const getCaseById = async (
  req: Request,
  charityCases: ICase['id'][],
  caseId: string
): Promise<GetCaseByIdResponse> => {
  caseUtils.checkIfCaseBelongsToCharity(req, charityCases, caseId);

  const _case: ICase = await caseUtils.getCaseByIdFromDB(req, caseId);

  return {
    case: _case,
  };
};

const deleteCase = async (
  req: Request,
  charity: ICharity,
  caseId: string
): Promise<DeleteCaseResponse> => {
  const isCaseFinished = await caseUtils.getCaseByIdFromDB(req, caseId);
  if (isCaseFinished.finished) throw new BadRequestError(req.t('errors.cantDeleteCase'));
  if (isCaseFinished.currentDonationAmount > 0)
    throw new BadRequestError(req.t('errors.cantDeleteCase'));

  const idx: number = caseUtils.checkIfCaseBelongsToCharity(req, charity.cases, caseId);

  const deletedCase: ICase = await caseUtils.deleteCaseFromDB(req, caseId);

  await caseUtils.deleteCaseFromCharityCasesArray(charity, idx);

  if (deletedCase.mainType === 'customizedCampaigns' && deletedCase.user) {
    //delete the id from the contributions arr of user and send email
    const user = new USER();

    const userOwner = await user.userModel.findUserById(deletedCase.user.toString());
    if (!userOwner) throw new BadRequestError('no user found');

    const idx = userUtilsInstance.checkIfCaseBelongsToUserContributions(
      userOwner.contributions,
      deletedCase._id.toString()
    );
    await userUtilsInstance.deleteCaseFromUserContributionsArray(userOwner, idx);

    await setupMailSender(
      userOwner.email,
      `request Fundraising campaign`,
      `hello ${userOwner.name.firstName} ${userOwner.name.lastName} -- we ${charity.name} charity are sorry that your fundraising request had been rejected`
    );
  }

  return {
    case: deletedCase,
  };
};

const editCase = async (
  req: Request,
  charity: ICharity,
  caseData: ICase & { coverImage: string; image: string[] },
  caseId: string
): Promise<EditCaseResponse> => {
  const isFinishedCase = await caseUtils.getCaseByIdFromDB(req, caseId);
  if (isFinishedCase.finished) throw new BadRequestError(req.t('errors.cantEditCase'));

  caseUtils.checkIfCaseBelongsToCharity(req, charity.cases, caseId);

  let deleteOldImg: (() => void) | null = null;
  if (caseData.image) {
    deleteOldImg = await caseUtils.replaceCaseImg(caseData, caseId);
  }

  const updatedCase: ICase = await caseUtils.editCase(caseData, caseId);

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
  getAllCasesForUser,
};
