import {
  AccType,
  CharitiesAccountsByAggregation,
  ConfirmedCharities,
  ICharity,
  ICharityDocs,
  PendingCharities,
} from '@components/charity/data-access/interfaces';
import { IUser } from '@components/user/data-access/interfaces';
import { BadRequestError, NotFoundError } from '@libs/errors/components';
import { deleteOldImgs } from '@utils/deleteFile';
import { notificationManager } from '@utils/sendNotification';
import { Request } from 'express';

import { adminUtilsSkeleton } from '../data-access/interfaces/admin.dao';
import { QueryObject } from '../data-access/interfaces/admin.interface';
import { ADMIN } from './admin.class';

export class adminUtilsClass implements adminUtilsSkeleton {
  notificationInstance: notificationManager;
  adminInstance: ADMIN;
  constructor() {
    this.notificationInstance = new notificationManager();
    this.adminInstance = new ADMIN();
  }
  async getAllPendingPaymentMethodsRequestsForConfirmedCharity(
    paymentMethod: string // bankAccount | fawry...
  ): Promise<CharitiesAccountsByAggregation[]> {
    const paymentMethodRequests =
      await this.adminInstance.adminModel.getPendingPaymentAccountByAggregation(paymentMethod);

    return paymentMethodRequests; // []
  }

  async confirmingCharity(req: Request, charity: PendingCharities) {
    charity.isPending = false;
    charity.isConfirmed = true;
    //enable all paymentMethods when first time the charity send the docs
    if (charity && charity.paymentMethods) {
      charity.paymentMethods.bankAccount.forEach(item => {
        item.enable = true;
      });
      charity.paymentMethods.fawry.forEach(item => {
        item.enable = true;
      });
      charity.paymentMethods.vodafoneCash.forEach(item => {
        item.enable = true;
      });
    }
    await charity.save();
    this.notificationInstance.sendNotification(
      'Charity',
      charity._id,
      req.t('notifications.charityConfirmed'),
      3 * 24 * 60 * 60 * 1000
    );
  }

  // const rejectingCharity = async (charity: ICharity) => {
  async rejectingCharity(req: Request, charity: PendingCharities) {
    charity.isPending = false;
    charity.isConfirmed = false;

    // U can't use the indexing operation with the string 'docs' + i on it without ensuring it's defined.
    if (charity.charityDocs) {
      for (let i = 1; i <= 4; ++i) {
        const docsKey = ('docs' + i) as keyof typeof charity.charityDocs;

        // Check if the property exists in charity.charityDocs
        if (Object.prototype.hasOwnProperty.call(charity.charityDocs, docsKey)) {
          deleteOldImgs('charityDocs', charity.charityDocs[`${docsKey}`]);
        }
      }
    }
    charity.charityDocs = {
      docs1: [],
      docs2: [],
      docs3: [],
      docs4: [],
    };

    // Map => Associate each payment method with its corresponding document type or field.
    const paymentMethods = new Map([
      ['bankAccount', 'bankDocs'],
      ['fawry', 'fawryDocs'],
      ['vodafoneCash', 'vodafoneCashDocs'],
    ]);
    // bankAccount: bankDocs
    // fawry: fawryDocs
    // vodafoneCash: vodafoneCashDocs

    if (charity.paymentMethods) {
      for (const [method, docs] of paymentMethods) {
        const methodKey = method as keyof typeof charity.paymentMethods;

        charity.paymentMethods[`${methodKey}`].forEach((acc: AccType) => {
          if (docs in acc) {
            deleteOldImgs('charityDocs', docs);
          }
        });
        charity.paymentMethods[`${methodKey}`] = [];
      }
    }
    await charity.save();

    this.notificationInstance.sendNotification(
      'Charity',
      charity._id,
      //
      req.t('notifications.charityRejected'),
      3 * 24 * 60 * 60 * 1000
    );
  }

  checkPaymentMethodAvailability(
    // charity: ICharity,
    charity: PendingCharities,
    paymentMethod: keyof ICharityDocs['paymentMethods'],
    paymentAccountID: string
  ): number {
    if (
      paymentMethod !== 'bankAccount' &&
      paymentMethod !== 'vodafoneCash' &&
      paymentMethod !== 'fawry'
    ) {
      throw new BadRequestError('Invalid Payment Method type');
    }

    if (!charity.paymentMethods) throw new NotFoundError('Not found any payment methods');

    const idx: number = charity.paymentMethods[`${paymentMethod}`].findIndex(
      item => item._id == paymentAccountID
    );

    if (idx === -1) throw new BadRequestError('not found Payment Method account');

    return idx;
  }

  async getConfirmedCharities(queryObject: QueryObject): Promise<PendingCharities> {
    // [ { name email paymentMethods _id } ]
    const charities: PendingCharities[] =
      await this.adminInstance.adminModel.findCharitiesByQueryWithOptionalId(
        queryObject,
        'name email paymentMethods'
      );

    if (!charities[0]) throw new BadRequestError('charity not found');

    return charities[0]; // { name email paymentMethods _id }
  }

  async confirmingPaymentAccount(
    req: Request,
    charity: PendingCharities,
    paymentMethod: keyof ICharityDocs['paymentMethods'], // Restrict the possible values for the paymentMethod
    idx: number
  ): Promise<void> {
    if (!charity.paymentMethods) throw new NotFoundError('Not found any payment methods');

    const paymentMethodData: AccType[] = charity.paymentMethods[`${paymentMethod}`]; // [ { Data } ]

    const paymentAccount: AccType | undefined = paymentMethodData[`${idx}`]; // { }

    if (!paymentAccount) throw new NotFoundError('This payment account not found');

    if (paymentAccount.enable === false) {
      paymentAccount.enable = true;
    } else {
      throw new BadRequestError('Already this payment account is enabled');
    }

    await charity.save();

    this.notificationInstance.sendNotification(
      'Charity',
      charity._id,
      req.t('notifications.paymentAccountConfirmed'),
      3 * 24 * 60 * 60 * 1000
    );
  }

  async rejectingPaymentAccount(
    req: Request,
    charity: ConfirmedCharities,
    // paymentMethod: string, // Allows any string value, which could include invalid keys
    paymentMethod: keyof ICharityDocs['paymentMethods'], // Restrict the possible values for the paymentMethod
    idx: number
  ): Promise<void> {
    if (!charity.paymentMethods) throw new NotFoundError('Not found any payment methods');

    const paymentMethodData: AccType[] = charity.paymentMethods[`${paymentMethod}`]; // [ { Data } ]

    const paymentAccount: AccType | undefined = paymentMethodData[`${idx}`]; // { }

    if (!paymentAccount) throw new NotFoundError('This payment account not found');

    if (paymentAccount.enable === false) {
      throw new BadRequestError('This payment account is already not enabled');
    }

    let urlOldImage: string[] | null = null;

    // TypeScript only allows access to properties that are common to all types in a union.
    if (paymentMethod === 'vodafoneCash') {
      const vodafoneCashAccount: AccType = paymentAccount;
      // This check cuzOf AccType is oring between multiple choice
      if ('vodafoneCashDocs' in vodafoneCashAccount) {
        urlOldImage = vodafoneCashAccount.vodafoneCashDocs;
      }
    } else if (paymentMethod === 'bankAccount') {
      const bankAccount: AccType = paymentAccount;
      if ('bankDocs' in bankAccount) {
        urlOldImage = bankAccount.bankDocs;
      }
    } else if (paymentMethod === 'fawry') {
      const fawryAccount: AccType = paymentAccount;
      if ('fawryDocs' in fawryAccount) urlOldImage = fawryAccount.fawryDocs;
    }

    paymentMethodData.splice(idx, 1); // Removing 1 acc at index idx
    if (urlOldImage) {
      deleteOldImgs('charityDocs', urlOldImage);
    } else {
      throw new BadRequestError('No docs found for that account');
    }
    await charity.save();

    this.notificationInstance.sendNotification(
      'Charity',
      charity._id,
      // Your payment account has been rejected
      req.t('notifications.paymentAccountRejected'),
      3 * 24 * 60 * 60 * 1000
    );
  }
  async resetRegisterOperation(entity: ICharity | IUser): Promise<boolean> {
    if (entity && typeof entity === 'object' && 'cases' in entity && 'cases' in entity) {
      //to ensure the entity type using type guard
      const res = await this.adminInstance.adminModel.deleteCharityByEmail(entity.email);
      if (!res) throw new BadRequestError('fatal error while regestering');
      return true;
    } else {
      const res = await this.adminInstance.adminModel.deleteUserByEmail(entity.email);
      if (!res) throw new BadRequestError('fatal error while regestering');
      return true;
    }
  }
}
