import {
  BadRequestError,
  NotFoundError,
} from '../../../libraries/errors/components/index';
import { checkValueEquality } from '../../../utils/shared';
import { TransactionRepository } from '../data-access/transaction.repository';
import { transactionUtils } from './transaction.utils';
import {
  IDataPreCreateTransaction,
  IDataUpdateCaseInfo,
  ITransaction,
  ITransactionDocument,
  TransactionPaymentInfo,
} from '../data-access/interfaces/transaction.interface';
import { IUserDocument } from '../../user/data-access/interfaces/user.interface';
const transactionRepository = new TransactionRepository();
const preCreateTransaction = async (
  data: IDataPreCreateTransaction,
  user: IUserDocument
): Promise<boolean> => {
  //must check the account for the charity is valid or not
  const {
    charityId,
    caseId,
    amount,
  }: {
    charityId: string;
    caseId: string;
    amount: number;
    mainTypePayment: string;
  } = data;
  //pre processing
  transactionUtils.checkPreCreateTransaction(data);

  const caseIsExist = await transactionRepository.findCaseById(caseId);
  if (!caseIsExist) {
    throw new NotFoundError('case is not found');
  }
  const charityIsExist = await transactionRepository.findCharityById(
    caseIsExist.charity.toString()
  );
  if (!charityIsExist) {
    throw new NotFoundError('charity is not found');
  }
  //check that charity is not confirmed or pending or the account not freezed
  transactionUtils.checkCharityIsValidToDonate(charityIsExist);

  //to check that the case is related to the charity id in the database
  const isMatch: boolean = checkValueEquality(
    caseIsExist.charity.toString(),
    charityId.toString()
  );
  if (!isMatch)
    throw new BadRequestError('mismatching while donating ...please try again');

  //check the case is finished or being freezed by the website admin
  transactionUtils.checkCaseIsValidToDonate(caseIsExist);
  //check that donor only donates with the remain part of money and not exceed the target amount
  const checker: boolean = transactionUtils.donationAmountAssertion(
    caseIsExist,
    amount
  );
  return checker;
};
const updateCaseInfo = async (
  data: IDataUpdateCaseInfo
): Promise<ITransaction | undefined> => {
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
  let caseIsExist = await transactionRepository.findCaseById(items[0].name); //the id of the case
  if (!caseIsExist) {
    throw new NotFoundError('case is not found');
  }
  //check user who made the transaction exist
  const userIsExist = await transactionRepository.findUserByEmail(user.email);
  if (!userIsExist) throw new BadRequestError('no user found');

  // implement the refund here
  const queryObj: { externalTransactionId: string; orderId: string } = {
    externalTransactionId: externalTransactionId,
    orderId: orderId,
  };

  let transactionIsExist: ITransactionDocument | null =
    await transactionRepository.findTransactionByQuery(queryObj);
  if (transactionIsExist) {
    //transaction must updated not created again
    transactionIsExist = await transactionUtils.refundUtility(
      transactionIsExist,
      amount
    );
    //in the next middleware will update the externalTransactionId with the new refund transaction
    return transactionIsExist;
  } //else  console.log('no transaction found for refund so will create new one');

  //what if status = pending?

  //start updating the case info
  //check if that is the last donation to finish this case
  caseIsExist = transactionUtils.checkIsLastDonation(caseIsExist, amount);
  caseIsExist = transactionUtils.updateCaseAfterDonation(caseIsExist, amount);

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
  const transactionData: ITransaction = {
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
  const newTransaction = await transactionRepository.createTransaction(
    transactionData
  );
  if (!newTransaction) throw new BadRequestError('no transaction found');
  //add the transaction id to the user
  await transactionUtils.addTransactionIdToUserTransactionIds(
    userIsExist,
    newTransaction._id.toString()
  );
  if (status == 'failed') {
    return newTransaction;
    // throw new BadRequestError('transaction failed please try again');
  }
  await transactionUtils.confirmSavingCase(caseIsExist);
  console.log({ status: newTransaction.status }); //, data: newTransaction });
  return newTransaction;
};
const getAllTransactions = async (
  user
): Promise<{ allTransactions: (ITransaction | null)[] }> => {
  const allTransactionsPromised =
    await transactionUtils.getAllTransactionsPromised(user);
  return { allTransactions: allTransactionsPromised };
};
export const transactionService = {
  preCreateTransaction,
  getAllTransactions,
  updateCaseInfo,
};
