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
import { charityUtilsClass } from '@components/charity/domain/charity.utils';
import { BadRequestError, NotFoundError } from '@libs/errors/components/index';
import { setupMailSender } from '@utils/mailer';
import { Request } from 'express';

import { adminServiceSkeleton } from '../data-access/interfaces/admin.dao';
import { QueryObject } from '../data-access/interfaces/admin.interface';
import { ADMIN } from './admin.class';
import { adminUtilsClass } from './admin.utils';

export class adminServiceClass implements adminServiceSkeleton {
  adminInstance: ADMIN;
  adminUtilsInstance: adminUtilsClass;
  charityUtilsInstance: charityUtilsClass;
  constructor() {
    this.adminUtilsInstance = new adminUtilsClass();
    this.adminInstance = new ADMIN();
    this.charityUtilsInstance = new charityUtilsClass();
  }

  async getAllChariteis(): Promise<{
    charities: AllCharities[];
  }> {
    // this.charityUtilsInstance.getTotalNumberOfDonorsAndDonationsIncome();
    const charities = await this.adminInstance.adminModel.findAllCharities(
      'name email isPending isConfirmed numberOfCases image createdAt totalNumberOfDonors totalDonationsIncome'
    );

    return { charities: charities };
  }

  async getAllUsers() {
    const users = await this.adminInstance.adminModel.findAllUsers(
      'name email phone totalDonationsAmount'
    );

    return { users: users };
  }

  async getCharityById(id: string) {
    const charity = await this.adminInstance.adminModel.findCharityById(id);

    if (!charity) throw new BadRequestError('Charity not found');

    return { charity: charity };
  }

  async getAllOrOnePendingRequestsCharities(
    req: Request,
    id: string | null = null
  ): Promise<{ allPendingCharities: PendingCharities[] }> {
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
    const allPendingCharities: PendingCharities[] =
      await this.adminInstance.adminModel.findAllPendingCharities(
        queryObject,
        'name email charityDocs paymentMethods'
      );

    if (id && !allPendingCharities[0]) throw new BadRequestError(req.t('errors.charityNotFound'));

    return { allPendingCharities: allPendingCharities };
  }

  async confirmPaymentAccountRequestForConfirmedCharities(
    req: Request,
    charityId: string,
    // paymentMethod: string, // Allows any string value, which could include invalid keys
    paymentMethod: keyof ICharityDocs['paymentMethods'], // Restrict the possible values for the paymentMethod
    paymentAccountID: string
  ): Promise<{
    charity: PendingCharities;
    message: string;
  }> {
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
    const charity: PendingCharities =
      await this.adminUtilsInstance.getConfirmedCharities(queryObject); // charities[0]

    const idx: number = this.adminUtilsInstance.checkPaymentMethodAvailability(
      charity,
      paymentMethod,
      paymentAccountID
    );

    await this.adminUtilsInstance.confirmingPaymentAccount(req, charity, paymentMethod, idx);

    await setupMailSender(
      charity.email,
      'Charity payment account has been confirmed successfully',
      `after reviewing the payment account docs we accept it, now you are ready to help the world with us by start to share cases need help`
    );

    return {
      charity: charity,
      message: 'Charity payment account has been confirmed successfully',
    };
  }

  async rejectPaymentAccountRequestForConfirmedCharities(
    req: Request,
    charityId: string,
    // paymentMethod: string, // Allows any string value, which could include invalid keys
    paymentMethod: keyof ICharityDocs['paymentMethods'], // Restrict the possible values for the paymentMethod
    paymentAccountID: string
  ): Promise<ConfirmPendingCharity> {
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

    const charity: ConfirmedCharities =
      await this.adminUtilsInstance.getConfirmedCharities(queryObject);

    const idx: number = this.adminUtilsInstance.checkPaymentMethodAvailability(
      charity,
      paymentMethod,
      paymentAccountID
    );

    await this.adminUtilsInstance.rejectingPaymentAccount(req, charity, paymentMethod, idx);

    await setupMailSender(
      charity.email,
      'Charity payment account has been rejected',
      `after reviewing the payment account docs we reject it,you can re upload the docs again, BeCareful to add correct info`
    );
    return {
      charity: charity,
      message: 'Charity payment account has been rejected',
    };
  }
  // That mean if charity makes a requestEditCharityPayment (add another acc for receive payment)
  async getPendingPaymentRequestsForConfirmedCharityById(
    req: Request,
    id: string
  ): Promise<{
    paymentRequestsAccounts: {
      bankAccount: CharityPaymentMethodBankAccount[] | undefined;
      fawry: CharityPaymentMethodFawry[] | undefined;
      vodafoneCash: CharityPaymentMethodVodafoneCash[] | undefined;
    };
  }> {
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
      await this.adminInstance.adminModel.findConfirmedCharityById(
        queryObject,
        'paymentMethods _id'
      );

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
  }

  async getAllRequestsPaymentMethodsForConfirmedCharities(): Promise<{
    allPaymentAccounts: {
      bankAccountRequests: CharitiesAccountsByAggregation[];
      fawryRequests: CharitiesAccountsByAggregation[];
      vodafoneCashRequests: CharitiesAccountsByAggregation[];
    };
  }> {
    const bankAccountRequests: CharitiesAccountsByAggregation[] =
      await this.adminUtilsInstance.getAllPendingPaymentMethodsRequestsForConfirmedCharity(
        'bankAccount'
      ); // [ { _id, name, paymentMethods }, { }, ... ]

    const fawryRequests: CharitiesAccountsByAggregation[] =
      await this.adminUtilsInstance.getAllPendingPaymentMethodsRequestsForConfirmedCharity('fawry');

    const vodafoneCashRequests: CharitiesAccountsByAggregation[] =
      await this.adminUtilsInstance.getAllPendingPaymentMethodsRequestsForConfirmedCharity(
        'vodafoneCash'
      );

    if (!bankAccountRequests && !fawryRequests && !vodafoneCashRequests)
      throw new BadRequestError('No paymentRequests found');

    return {
      allPaymentAccounts: {
        bankAccountRequests,
        fawryRequests,
        vodafoneCashRequests,
      },
    };
  }

  async confirmCharity(req: Request, id: string): Promise<ConfirmPendingCharity> {
    const charity = await this.getAllOrOnePendingRequestsCharities(req, id);
    // { allPendingCharities: allPendingCharities }

    const pendingCharity: PendingCharities | undefined = charity.allPendingCharities[0];

    if (!pendingCharity) throw new NotFoundError('Charity not found');

    await this.adminUtilsInstance.confirmingCharity(req, pendingCharity);
    // await adminUtils.confirmingCharity(req, pendingCharity);

    await setupMailSender(
      pendingCharity.email,
      'Charity has been confirmed successfully',
      `after reviewing the charity docs we accept it, now you are ready to help the world with us by start to share cases need help`
    );

    return {
      charity: charity.allPendingCharities[0],
      message: req.t('errors.charityConfirmed'),
    };
  }

  async rejectCharity(req: Request, id: string): Promise<ConfirmPendingCharity> {
    const charity: AllPendingRequestsCharitiesResponse =
      await this.getAllOrOnePendingRequestsCharities(req, id);

    const pendingCharity: PendingCharities | undefined = charity.allPendingCharities[0];

    if (!pendingCharity) throw new NotFoundError('Charity not found');

    await this.adminUtilsInstance.rejectingCharity(req, pendingCharity);

    await setupMailSender(
      pendingCharity.email,
      'Charity has not been confirmed',
      `you must upload all the docs mentioned to auth the charity and always keep the quality of the docs high and clear`
    );

    return {
      charity: charity.allPendingCharities[0],
      message: 'Charity has not been confirmed',
    };
  }
}
