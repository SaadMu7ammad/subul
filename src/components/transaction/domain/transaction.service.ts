import {
  IDataPreCreateTransaction,
  IDataUpdateCaseInfo,
  TransactionPaymentInfo,
  transactionServiceSkeleton,
} from '@components/transaction/data-access/interfaces';
import { ITransaction } from '@components/transaction/data-access/interfaces';
import { TRANSACTION } from '@components/transaction/data-access/transaction.repository';
import { IUser } from '@components/user/data-access/interfaces';
import { BadRequestError, NotFoundError } from '@libs/errors/components/index';
import { checkValueEquality } from '@utils/shared';

import { transactionUtilsClass } from './transaction.utils';

export class transactionServiceClass implements transactionServiceSkeleton {
  #transactionRepository = new TRANSACTION();
  #transactionInstance = this.#transactionRepository.transactionModel;

  #transactionUtilsInstance = new transactionUtilsClass();

  async preCreateTransaction(data: IDataPreCreateTransaction, user: IUser): Promise<boolean> {
    //must check the account for the charity is valid or not
    const { charityId, caseId, amount } = data;
    //pre processing
    this.#transactionUtilsInstance.checkPreCreateTransaction(data);

    const caseIsExist = await this.#transactionInstance.findCaseById(caseId);
    if (!caseIsExist) {
      throw new NotFoundError('case is not found');
    }
    const charityIsExist = await this.#transactionInstance.findCharityById(
      caseIsExist.charity.toString()
    );
    if (!charityIsExist) {
      throw new NotFoundError('charity is not found');
    }
    //check that charity is not confirmed or pending or the account not freezed
    this.#transactionUtilsInstance.checkCharityIsValidToDonate(charityIsExist);

    //to check that the case is related to the charity id in the database
    const isMatch = checkValueEquality(caseIsExist.charity.toString(), charityId.toString());
    if (!isMatch) throw new BadRequestError('mismatching while donating ...please try again');

    //check the case is finished or being freezed by the website admin
    this.#transactionUtilsInstance.checkCaseIsValidToDonate(caseIsExist);
    //check that donor only donates with the remain part of money and not exceed the target amount
    const checker = this.#transactionUtilsInstance.donationAmountAssertion(caseIsExist, amount);
    return checker;
  }

  async updateCaseInfo(data: IDataUpdateCaseInfo): Promise<ITransaction | null> {
    //start updating
    const {
      user,
      items,
      externalTransactionId,
      orderId,
      amount,
      date,
      paymentMethodType,
      status,
      currency,
      secretInfoPayment,
    } = data;
    if (!items?.[0]?.name) throw new NotFoundError('case not found');
    if (!user.email) throw new NotFoundError('user not found');

    //check case is stored or not in the case table
    let caseIsExist = await this.#transactionInstance.findCaseById(items[0].name); //the id of the case
    if (!caseIsExist) {
      throw new NotFoundError('case is not found');
    }
    //check user who made the transaction exist
    const userIsExist = await this.#transactionInstance.findUserByEmail(user.email);
    if (!userIsExist) throw new BadRequestError('no user found');

    // implement the refund here
    const queryObj: { externalTransactionId: string; orderId: string } = {
      externalTransactionId: externalTransactionId,
      orderId: orderId,
    };

    let transactionIsExist: ITransaction | null =
      await this.#transactionInstance.findTransactionByQuery(queryObj);
    if (transactionIsExist) {
      //transaction must updated not created again
      transactionIsExist = await this.#transactionUtilsInstance.refundUtility(
        transactionIsExist,
        amount
      );
      //in the next middleware will update the externalTransactionId with the new refund transaction
      return transactionIsExist;
    } //else  console.log('no transaction found for refund so will create new one');

    //what if status = pending?

    //start updating the case info
    //check if that is the last donation to finish this case
    caseIsExist = this.#transactionUtilsInstance.checkIsLastDonation(caseIsExist, amount);
    caseIsExist = this.#transactionUtilsInstance.updateCaseAfterDonation(caseIsExist, amount);

    //now everything is ready for creating the transaction

    // to know the type of payment method that donor paid with
    let paymentMethod: TransactionPaymentInfo = {};

    if (paymentMethodType === 'card') {
      paymentMethod = {
        onlineCard: {
          lastFourDigits: secretInfoPayment,
        },
      };
    } else if (paymentMethodType === 'wallet') {
      paymentMethod = {
        mobileWallet: {
          number: secretInfoPayment,
        },
      };
    }
    //what if the payment happened but the transaction not stored in the db??i think must make a report or something like that to alert that to support
    const transactionData: Partial<ITransaction> = {
      case: caseIsExist._id,
      user: userIsExist._id,
      moneyPaid: +amount,
      paidAt: date,
      externalTransactionId: externalTransactionId,
      orderId: orderId,
      paymentGateway: 'Paymob',
      paymentInfo: paymentMethod,
      status,
      currency,
    };
    const newTransaction = await this.#transactionInstance.createTransaction(transactionData);
    if (!newTransaction) throw new BadRequestError('no transaction found');
    //add the transaction id to the user
    await this.#transactionUtilsInstance.addTransactionIdToUserTransactionIds(
      userIsExist,
      newTransaction._id
    );
    if (status == 'failed') {
      return newTransaction;
      // throw new BadRequestError('transaction failed please try again');
    }
    await this.#transactionUtilsInstance.confirmSavingCase(caseIsExist);
    console.log({ status: newTransaction.status }); //, data: newTransaction });
    return newTransaction;
  }
  async getAllTransactions(user: IUser): Promise<{ allTransactions: (ITransaction | null)[] }> {
    const allTransactionsPromised =
      await this.#transactionUtilsInstance.getAllTransactionsPromised(user);
    return { allTransactions: allTransactionsPromised };
  }
}
// export const transactionService = {
//   preCreateTransaction,
//   getAllTransactions,
//   updateCaseInfo,
// };
