import { adminRepository } from '@components/admin/data-access/admin.repository';
import {
  AllCharities,
  AllPendingRequestsCharitiesResponse,
  CharitiesAccountsByAggregation,
  CharityPaymentMethodBankAccount,
  CharityPaymentMethodFawry,
  CharityPaymentMethodVodafoneCash,
  ConfirmPendingCharity,
  ConfirmedCharities,
  DataForForConfirmedCharity,
  ICharityDocs,
  PendingCharities,
} from '@components/charity/data-access/interfaces';
import { charityUtils } from '@components/charity/domain/charity.utils';
import { BadRequestError, NotFoundError } from '@libs/errors/components/index';
import { setupMailSender } from '@utils/mailer';
import { Request } from 'express';
import mongoose from 'mongoose';

import { adminUtils } from './admin.utils';

// import { setupMailSender } from '../../../utils/mailer';

export type QueryObject = {
  $and: {
    isPending?: boolean;
    isEnabled?: boolean;
    isConfirmed?: boolean;
    $or?: { [key: string]: boolean }[];
    _id?: mongoose.Types.ObjectId | string;
  }[];
};

const getAllChariteis = async () => {
  charityUtils.getTotalNumberOfDonorsAndDonationsIncome();
  const charities: AllCharities[] = await adminRepository.findAllCharities(
    'name email isPending isConfirmed numberOfCases image createdAt totalNumberOfDonors totalDonationsIncome'
  );

  return { charities: charities };
};

const getAllUsers = async () => {
  const users = await adminRepository.findAllUsers('name email');

  return { users: users };
};

const getCharityById = async (id: string) => {
  const charity = await adminRepository.findCharityById(id);

  if (!charity) throw new BadRequestError('Charity not found');

  return { charity: charity };
};
const getAllOrOnePendingRequestsCharities = async (req: Request, id: string | null = null) => {
  const queryObject: QueryObject = {
    $and: [
      { isPending: true },
      { isEnabled: true },
      { isConfirmed: false },
      {
        $or: [{ 'emailVerification.isVerified': true }, { 'phoneVerification.isVerified': true }],
      },
      id ? { _id: id } : {}, // to find by Id only one
      // id ? { _id: new mongoose.Types.ObjectId(id) } : {},
    ],
  };
  const allPendingCharities: PendingCharities[] = await adminRepository.findAllPendingCharities(
    queryObject,
    'name email charityDocs paymentMethods'
  );

  if (id && !allPendingCharities[0]) throw new BadRequestError(req.t('errors.charityNotFound'));

  return { allPendingCharities: allPendingCharities };
};

const confirmPaymentAccountRequestForConfirmedCharities = async (
  charityId: string,
  // paymentMethod: string, // Allows any string value, which could include invalid keys
  paymentMethod: keyof ICharityDocs['paymentMethods'], // Restrict the possible values for the paymentMethod
  paymentAccountID: string
) => {
  const queryObject: QueryObject = {
    $and: [
      { isPending: false },
      { isEnabled: true },
      { isConfirmed: true },
      {
        $or: [{ 'emailVerification.isVerified': true }, { 'phoneVerification.isVerified': true }],
      },
      { _id: charityId },
    ],
  };
  const charity: PendingCharities = await adminUtils.getConfirmedCharities(queryObject); // charities[0]

  const idx: number = adminUtils.checkPaymentMethodAvailability(
    charity,
    paymentMethod,
    paymentAccountID
  );

  await adminUtils.confirmingPaymentAccount(charity, paymentMethod, idx);

  await setupMailSender(
    charity.email,
    'Charity payment account has been confirmed successfully',
    `after reviewing the payment account docs we accept it, now you are ready to help the world with us by start to share cases need help`
  );

  return {
    charity: charity,
    message: 'Charity payment account has been confirmed successfully',
  };
};

const rejectPaymentAccountRequestForConfirmedCharities = async (
  charityId: string,
  // paymentMethod: string, // Allows any string value, which could include invalid keys
  paymentMethod: keyof ICharityDocs['paymentMethods'], // Restrict the possible values for the paymentMethod
  paymentAccountID: string
): Promise<ConfirmPendingCharity> => {
  const queryObject: QueryObject = {
    $and: [
      { isPending: false },
      { isEnabled: true },
      { isConfirmed: true },
      {
        $or: [{ 'emailVerification.isVerified': true }, { 'phoneVerification.isVerified': true }],
      },
      { _id: charityId },
    ],
  };

  const charity: ConfirmedCharities = await adminUtils.getConfirmedCharities(queryObject);

  const idx: number = adminUtils.checkPaymentMethodAvailability(
    charity,
    paymentMethod,
    paymentAccountID
  );

  await adminUtils.rejectingPaymentAccount(charity, paymentMethod, idx);

  await setupMailSender(
    charity.email,
    'Charity payment account has been rejected',
    `after reviewing the payment account docs we reject it,you can re upload the docs again, BeCareful to add correct info`
  );
  return {
    charity: charity,
    message: 'Charity payment account has been rejected',
  };
};

// That mean if charity makes a requestEditCharityPayment (add another acc for receive payment)
const getPendingPaymentRequestsForConfirmedCharityById = async (req: Request, id: string) => {
  const queryObject: QueryObject = {
    $and: [
      { isPending: false },
      { isEnabled: true },
      { isConfirmed: true },
      {
        $or: [{ 'emailVerification.isVerified': true }, { 'phoneVerification.isVerified': true }],
      },
      id ? { _id: id } : {}, // to find by Id only one
    ],
  };
  const paymentRequests: DataForForConfirmedCharity =
    await adminRepository.findConfirmedCharityById(queryObject, 'paymentMethods _id');

  if (!paymentRequests) throw new BadRequestError('No payment requests found!');

  const bankAccount: CharityPaymentMethodBankAccount[] | undefined =
    paymentRequests.paymentMethods?.bankAccount.filter(
      (acc: CharityPaymentMethodBankAccount) => acc.enable === false
    );

  const fawry: CharityPaymentMethodFawry[] | undefined =
    paymentRequests.paymentMethods?.fawry.filter(
      (acc: CharityPaymentMethodFawry) => acc.enable === false
    );

  const vodafoneCash: CharityPaymentMethodVodafoneCash[] | undefined =
    paymentRequests.paymentMethods?.vodafoneCash.filter(
      (acc: CharityPaymentMethodVodafoneCash) => acc.enable === false
    );

  // RETURNS ONLY THE NEW REQUEST ACC TO BE APPROVED👇
  return { paymentRequestsAccounts: { bankAccount, fawry, vodafoneCash } };
};

const getAllRequestsPaymentMethodsForConfirmedCharities = async () => {
  const bankAccountRequests: CharitiesAccountsByAggregation[] =
    await adminUtils.getAllPendingPaymentMethodsRequestsForConfirmedCharity('bankAccount'); // [ { _id, name, paymentMethods }, { }, ... ]

  const fawryRequests: CharitiesAccountsByAggregation[] =
    await adminUtils.getAllPendingPaymentMethodsRequestsForConfirmedCharity('fawry');

  const vodafoneCashRequests: CharitiesAccountsByAggregation[] =
    await adminUtils.getAllPendingPaymentMethodsRequestsForConfirmedCharity('vodafoneCash');

  if (!bankAccountRequests && !fawryRequests && !vodafoneCashRequests)
    throw new BadRequestError('No paymentRequests found');

  return {
    allPaymentAccounts: {
      bankAccountRequests,
      fawryRequests,
      vodafoneCashRequests,
    },
  };
};

const confirmCharity = async (req: Request, id: string): Promise<ConfirmPendingCharity> => {
  // const charity: AllPendingRequestsCharitiesResponse =
  //   await getAllOrOnePendingRequestsCharities(id);
  const charity = await getAllOrOnePendingRequestsCharities(req, id);
  // { allPendingCharities: allPendingCharities }

  const pendingCharity: PendingCharities | undefined = charity.allPendingCharities[0];

  if (!pendingCharity) throw new NotFoundError('Charity not found');

  await adminUtils.confirmingCharity(pendingCharity);

  await setupMailSender(
    pendingCharity.email,
    'Charity has been confirmed successfully',
    `after reviewing the charity docs we accept it, now you are ready to help the world with us by start to share cases need help`
  );

  return {
    charity: charity.allPendingCharities[0],
    message: 'Charity has been confirmed successfully',
  };
};

const rejectCharity = async (req: Request, id: string): Promise<ConfirmPendingCharity> => {
  const charity: AllPendingRequestsCharitiesResponse = await getAllOrOnePendingRequestsCharities(
    req,
    id
  );

  const pendingCharity: PendingCharities | undefined = charity.allPendingCharities[0];

  if (!pendingCharity) throw new NotFoundError('Charity not found');

  await adminUtils.rejectingCharity(pendingCharity);

  await setupMailSender(
    pendingCharity.email,
    'Charity has not been confirmed',
    `you must upload all the docs mentioned to auth the charity and always keep the quality of the docs high and clear`
  );

  return {
    charity: charity.allPendingCharities[0],
    message: 'Charity has not been confirmed',
  };
};

export const adminService = {
  getAllChariteis,
  getAllUsers,
  getCharityById,
  getAllOrOnePendingRequestsCharities,
  confirmCharity,
  rejectCharity,
  rejectPaymentAccountRequestForConfirmedCharities,
  confirmPaymentAccountRequestForConfirmedCharities,
  getAllRequestsPaymentMethodsForConfirmedCharities,
  getPendingPaymentRequestsForConfirmedCharityById,
};
