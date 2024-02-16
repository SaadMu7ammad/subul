import {
  BadRequestError,
  NotFoundError,
} from '../../../libraries/errors/components/index.js';
import { transactionRepository } from '../data-access/transaction.repository.js';

const checkPreCreateTransaction = (data) => {
  const { charityId, caseId, amount, mainTypePayment } = data;
  if (!charityId) {
    throw new NotFoundError('charity is not found');
  } else if (!caseId) {
    throw new NotFoundError('id is not found');
  } else if (+amount === 0) {
    throw new BadRequestError('Invalid amount of donation');
  } else if (
    mainTypePayment !== 'mobileWallet' &&
    mainTypePayment !== 'onlineCard'
  ) {
    throw new NotFoundError('no payment method has been chosen');
  }
};
const checkCharityIsValidToDonate = (charity) => {
  if (
    charity.isConfirmed === false ||
    charity.isPending === true ||
    charity.isEnabled === false
  ) {
    throw new BadRequestError(
      'charity is not completed its authentication stages'
    );
  }
  if (
    charity.emailVerification.isVerified === false &&
    charity.phoneVerification.isVerified === false
  ) {
    throw new BadRequestError(
      'charity is not verified..must verify the account by email or phone number'
    );
  }
};
const checkCaseIsValidToDonate = (cause) => {
  if (cause.finished === true || cause.freezed === true) {
    throw new BadRequestError(
      'this case is finished...choose case not completed'
    );
  }
};
const donationAmountAssertion = (cause, amount) => {
  const currentAmount = +cause.currentDonationAmount + +amount;
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
};
const updateTransactionAfterRefund = async (transaction) => {
  transaction.status = 'refunded';
  await transaction.save();
};
const updateCaseAfterRefund = async (cause, amount) => {
  if (cause.finished) cause.finished = false; //re open the case again
  if (cause.currentDonationAmount >= amount)
    cause.currentDonationAmount -= amount;
  if (cause.donationNumbers >= 1) cause.donationNumbers -= 1;
  if (cause.dateFinished) cause.dateFinished = null;
  await cause.save();
};
const checkIsLastDonation = (cause, amount) => {
  const currentAmount = +cause.currentDonationAmount + +amount;
  if (+cause.targetDonationAmount === currentAmount) {
    cause.dateFinished = Date.now();
    cause.finished = true;
  }
  return cause;
};
const updateCaseAfterDonation = (cause, amount) => {
  +cause.donationNumbers++;
  cause.currentDonationAmount += +amount;
  return cause;
};
const addTransactionIdToUserTransactionIds = async (user, newTransactionId) => {
  user.transactions.push(newTransactionId);
  await user.save();
  return user;
};
const confirmSavingCase = async (cause) => {
  await cause.save();
};
const confirmSavingUser = async (user) => {
  await user.save();
};
const getAllTransactionsPromised = async (user) => {
  const transactionPromises = user.transactions.map(async (itemId, index) => {
    const myTransaction = await transactionRepository.findTransactionById(
      itemId
    );
    if (!myTransaction) {
      user.transactions.splice(index, 1);
      return null;
    } else {
      // console.log(myTransaction.user);
      if (myTransaction.user.toString() !== user._id.toString()) {
        throw new BadRequestError('you dont have access to this !');
      }
      return myTransaction;
    }
  });
  const allTransactionsPromised = await Promise.all(transactionPromises);
  await confirmSavingUser(user);
  return allTransactionsPromised;
};
const refundUtility = async (transaction,amount) => {
  const caseId = transaction.case; //get the id of the case
  if (!caseId) throw new NotFoundError('case id not found');

  const caseIsExistForRefund = await transactionRepository.findCaseById(caseId);
  if (!caseIsExistForRefund) throw new NotFoundError('case id not found');

  await updateTransactionAfterRefund(transaction);
  //update the case and decrement donation info
  await updateCaseAfterRefund(caseIsExistForRefund, amount);
  //in the next middleware will update the externalTransactionId with the new refund transaction
  console.log('transaction updated partially in db to be refunded');

  return { transaction: transaction };
};
export const transactionUtils = {
  checkPreCreateTransaction,
  checkCaseIsValidToDonate,
  checkCharityIsValidToDonate,
  donationAmountAssertion,
  updateTransactionAfterRefund,
  updateCaseAfterRefund,
  checkIsLastDonation,
  updateCaseAfterDonation,
  addTransactionIdToUserTransactionIds,
  confirmSavingCase,
  getAllTransactionsPromised,
  refundUtility,
};
