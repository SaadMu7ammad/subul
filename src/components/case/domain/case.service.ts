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
import { User } from '@components/user/data-access/interfaces';
import { userRepository } from '@components/user/data-access/user.repository';
import { userUtils } from '@components/user/domain/user.utils';
import { BadRequestError, NotFoundError } from '@libs/errors/components';
import { setupMailSender } from '@utils/mailer';
import { notifyAllUsers } from '@utils/sendNotification';
import { Response } from 'express';

import { caseUtils } from './case.utils';

const addCase = async (
  caseData: ICase,
  image: string,
  charity: ICharity,
  user: User | undefined = undefined
): Promise<AddCaseResponse> => {
  caseData.coverImage = image;
  caseData.charity = charity._id;
  const newCase = await caseUtils.createCase(caseData);

  if (!newCase) throw new BadRequestError('case not created... try again');

  charity.cases.push(newCase._id);

  await charity.save();

  if (user) {
    user.contributions.push(newCase._id);
    await user.save();
  }

  notifyAllUsers(
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
  charityCases: ICase['id'][],
  caseId: string
): Promise<GetCaseByIdResponse> => {
  caseUtils.checkIfCaseBelongsToCharity(charityCases, caseId);

  const _case: ICase = await caseUtils.getCaseByIdFromDB(caseId);

  return {
    case: _case,
  };
};

const deleteCase = async (charity: ICharity, caseId: string): Promise<DeleteCaseResponse> => {
  const isCaseFinished = await caseUtils.getCaseByIdFromDB(caseId);
  if (isCaseFinished.finished)
    throw new BadRequestError('you dont have access to delete a completed case');
  if (isCaseFinished.currentDonationAmount > 0)
    throw new BadRequestError('you dont have access to delete a case in progress');

  const idx: number = caseUtils.checkIfCaseBelongsToCharity(charity.cases, caseId);

  const deletedCase: ICase = await caseUtils.deleteCaseFromDB(caseId);

  await caseUtils.deleteCaseFromCharityCasesArray(charity, idx);

  if (deletedCase.mainType === 'customizedCampaigns' && deletedCase.user) {
    //delete the id from the contributions arr of user and send email
    const _userRepository = new userRepository();

    const userOwner = await _userRepository.findUserById(deletedCase.user.toString());
    if (!userOwner) throw new BadRequestError('no user found');

    const idx = userUtils.checkIfCaseBelongsToUserContributions(
      userOwner.contributions,
      deletedCase._id.toString()
    );
    await userUtils.deleteCaseFromUserContributionsArray(userOwner, idx);

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
  charity: ICharity,
  caseData: ICase & { coverImage: string; image: string[] },
  caseId: string
): Promise<EditCaseResponse> => {
  const isFinishedCase = await caseUtils.getCaseByIdFromDB(caseId);
  if (isFinishedCase.finished) throw new BadRequestError('cant edit completed case');

  caseUtils.checkIfCaseBelongsToCharity(charity.cases, caseId);

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
