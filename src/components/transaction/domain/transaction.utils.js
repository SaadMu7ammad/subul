import { transactionRepository } from '../data-access/transaction.repository.js';

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
const checkIsLastDonation = async (cause, amount) => {
  const currentAmount = +cause.currentDonationAmount + +amount;

  if (+cause.targetDonationAmount === currentAmount) {
    cause.dateFinished = Date.now();
    cause.finished = true;
  }
  return cause;
};
const updateCaseAfterDonation = async (cause, amount) => {
  +cause.donationNumbers++;
  cause.currentDonationAmount += +amount;
  return cause;
};
const addTransactionIdToUserTransactionIds = async (user, id) => {
  user.transactions.push(newTransaction._id);
  await user.save();
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
export const transactionUtils = {
  donationAmountAssertion,
  updateTransactionAfterRefund,
  updateCaseAfterRefund,
  checkIsLastDonation,
  updateCaseAfterDonation,
  addTransactionIdToUserTransactionIds,
  confirmSavingCase,
  getAllTransactionsPromised,
};
