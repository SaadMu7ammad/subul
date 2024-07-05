import { ICase } from '@components/case/data-access/interfaces/case.interface';
import CaseModel from '@components/case/data-access/models/case.model';
import { ICharity } from '@components/charity/data-access/interfaces';
import Charity from '@components/charity/data-access/models/charity.model';
import {
  IDataPreCreateTransaction,
  transactionUtilsSkeleton,
} from '@components/transaction/data-access/interfaces';
import { ITransaction } from '@components/transaction/data-access/interfaces';
import { IUser } from '@components/user/data-access/interfaces';
import UserModel from '@components/user/data-access/models/user.model';
import { BadRequestError, NotFoundError } from '@libs/errors/components/index';
import { Types } from 'mongoose';

import { TRANSACTION } from '../data-access/transaction.repository';

export class transactionUtilsClass implements transactionUtilsSkeleton {
  #transactionRepository: TRANSACTION;
  #transactionInstance: TRANSACTION;
  // #transactionInstance ;

  constructor() {
    this.#transactionRepository = new TRANSACTION();
    this.#transactionInstance = this.#transactionRepository;

    this.checkPreCreateTransaction = this.checkPreCreateTransaction.bind(this);
    this.checkCharityIsValidToDonate = this.checkCharityIsValidToDonate.bind(this);
    this.checkCaseIsValidToDonate = this.checkCaseIsValidToDonate.bind(this);
    this.donationAmountAssertion = this.donationAmountAssertion.bind(this);
    this.updateTransactionAfterRefund = this.updateTransactionAfterRefund.bind(this);
    this.updateCaseAfterRefund = this.updateCaseAfterRefund.bind(this);
    this.checkIsLastDonation = this.checkIsLastDonation.bind(this);
    this.updateCaseAfterDonation = this.updateCaseAfterDonation.bind(this);
    this.addTransactionIdToUserTransactionIds =
      this.addTransactionIdToUserTransactionIds.bind(this);
    this.confirmSavingCase = this.confirmSavingCase.bind(this);
    this.confirmSavingUser = this.confirmSavingUser.bind(this);
    this.getAllTransactionsPromised = this.getAllTransactionsPromised.bind(this);
    this.addDonorNameAndCharityNameToTransactions =
      this.addDonorNameAndCharityNameToTransactions.bind(this);
    this.confirmSavingUser = this.confirmSavingUser.bind(this);
    this.getAllTransactionsToCharity = this.getAllTransactionsToCharity.bind(this);
    this.refundUtility = this.refundUtility.bind(this);
  }
  async checkPreCreateTransaction(data: IDataPreCreateTransaction) {
    const { charityId, caseId, amount, mainTypePayment } = data;
    if (!charityId) {
      throw new NotFoundError('charity is not found');
    } else if (!caseId) {
      throw new NotFoundError('id is not found');
    } else if (+amount === 0) {
      throw new BadRequestError('Invalid amount of donation');
    } else if (mainTypePayment !== 'mobileWallet' && mainTypePayment !== 'onlineCard') {
      throw new NotFoundError('no payment method has been chosen');
    }
  }
  async checkCharityIsValidToDonate(charity: ICharity) {
    if (
      charity.isConfirmed === false ||
      charity.isPending === true ||
      charity.isEnabled === false
    ) {
      throw new BadRequestError('charity is not completed its authentication stages');
    }
    if (
      charity.emailVerification &&
      charity.emailVerification.isVerified === false &&
      charity.phoneVerification &&
      charity.phoneVerification.isVerified === false
    ) {
      throw new BadRequestError(
        'charity is not verified..must verify the account by email or phone number'
      );
    }
  }
  async checkCaseIsValidToDonate(cause: ICase) {
    if (cause.finished === true || cause.freezed === true) {
      throw new BadRequestError('this case is finished...choose case not completed');
    }
  }
  async donationAmountAssertion(cause: ICase, amount: number) {
    const currentAmount: number = +cause.currentDonationAmount + +amount;
    if (
      +cause.targetDonationAmount < currentAmount &&
      cause.targetDonationAmount !== currentAmount
    ) {
      throw new BadRequestError(
        'please donate with the remained value which is ' +
          (+cause.targetDonationAmount - +cause.currentDonationAmount)
      );
    }
    return true;
  }
  async updateTransactionAfterRefund(transaction: ITransaction) {
    transaction.status = 'refunded';
    await transaction.save();
  }
  async updateCaseAfterRefund(cause: ICase, amount: number) {
    if (cause.finished) cause.finished = false; //re open the case again
    if (cause.currentDonationAmount >= amount) cause.currentDonationAmount -= amount;
    if (cause.donationNumbers >= 1) cause.donationNumbers -= 1;
    if (cause.dateFinished) cause.dateFinished = undefined;
    await cause.save();
  }
  checkIsLastDonation(cause: ICase, amount: number): ICase {
    const currentAmount: number = +cause.currentDonationAmount! + +amount;
    if (+cause.targetDonationAmount === currentAmount) {
      cause.dateFinished = Date.now().toString();
      cause.finished = true;
    }
    return cause;
  }
  updateCaseAfterDonation(cause: ICase, amount: number): ICase {
    +cause.donationNumbers!++;
    cause.currentDonationAmount! += +amount;
    return cause;
  }
  async addTransactionIdToUserTransactionIds(
    user: IUser,
    newTransactionId: Types.ObjectId
  ): Promise<IUser> {
    user.transactions.push(newTransactionId);
    await user.save();
    return user;
  }
  async confirmSavingCase(cause: ICase) {
    await cause.save();
  }
  async confirmSavingUser(user: IUser) {
    await user.save();
  }
  async getAllTransactionsPromised(user: IUser): Promise<(ITransaction | null)[]> {
    const transactionPromises = user.transactions.map(async (itemId, index) => {
      const myTransaction = await this.#transactionInstance.transactionModel.findTransactionById(
        itemId.toString()
      );
      if (!myTransaction) {
        user.transactions.splice(index, 1);
        return null;
      } else {
        if (myTransaction?.user?.toString() !== user._id.toString()) {
          throw new BadRequestError("you don't have access to this !");
        }
        return myTransaction;
      }
    });

    // Add one for AllTransactions if user.isAdmin == true
    if (user.isAdmin) {
      const allTransactions: ITransaction[] =
        await this.#transactionInstance.transactionModel.findAllTransactions();
      await this.addDonorNameAndCharityNameToTransactions(allTransactions);
      return allTransactions;
    }

    const allTransactionsPromised = await Promise.all(transactionPromises);
    await this.addDonorNameAndCharityNameToTransactions(allTransactionsPromised);
    await this.confirmSavingUser(user);

    return allTransactionsPromised;
  }

  async addDonorNameAndCharityNameToTransactions(transactions: (ITransaction | null)[]) {
    for (const transaction of transactions) {
      if (!transaction) throw new NotFoundError('transaction not found');
      const charityObject = await CaseModel.findById(transaction?.case).select('charity').exec();
      const charityId = charityObject?.charity;
      const charityName = await Charity.findById(charityId).select('name').exec();
      transaction.charityName = charityName?.name;
      const UserObject = await UserModel.findById(transaction?.user).select('name').exec();
      transaction.donorName = UserObject?.name.firstName + ' ' + UserObject?.name.lastName;
    }
  }

  async getAllTransactionsToCharity(
    cause: string,
    charity: ICharity
  ): Promise<ITransaction[] | null> {
    const myTransactions = await this.#transactionInstance.transactionModel.findTransactionsByQuery(
      { charity: charity._id, case: cause }
    );
    // if (!myTransaction) return null;

    return myTransactions;
  }

  async refundUtility(transaction: ITransaction, amount: number): Promise<ITransaction> {
    const caseId: string | undefined = transaction?.case?.toString(); //get the id of the case
    if (!caseId) throw new NotFoundError('case id not found');

    const caseIsExistForRefund =
      await this.#transactionInstance.transactionModel.findCaseById(caseId);
    if (!caseIsExistForRefund) throw new NotFoundError('case id not found');

    await this.updateTransactionAfterRefund(transaction);
    //update the case and decrement donation info
    await this.updateCaseAfterRefund(caseIsExistForRefund, amount);
    //in the next middleware will update the externalTransactionId with the new refund transaction
    console.log('transaction updated partially in db to be refunded');

    return transaction;
  }
}
// export const transactionUtils = {
//   checkPreCreateTransaction,
//   checkCaseIsValidToDonate,
//   checkCharityIsValidToDonate,
//   donationAmountAssertion,
//   updateTransactionAfterRefund,
//   updateCaseAfterRefund,
//   checkIsLastDonation,
//   updateCaseAfterDonation,
//   addTransactionIdToUserTransactionIds,
//   confirmSavingCase,
//   getAllTransactionsPromised,
//   refundUtility,
// };
