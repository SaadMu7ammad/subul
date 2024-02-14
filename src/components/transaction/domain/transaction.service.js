import {
  BadRequestError,
  NotFoundError,
} from '../libraries/errors/components/index.js';
import { transactionRepository } from '../data-access/transaction.repository.js';
import { transactionUtils } from './transaction.utils.js';
const preCreateTransaction = async (data, user) => {
  //must check the account for the charity is valid or not
  const { charityId, caseId, amount, mainTypePayment } = data;
  //pre processing
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
  const caseIsExist = await transactionRepository.findCaseById(caseId);
  if (!caseIsExist) {
    throw new NotFoundError('case is not found');
  }
  const chariyIsExist = await transactionRepository.findCharityById(
    caseIsExist.charity
  );
  if (!chariyIsExist) {
    throw new NotFoundError('charity is not found');
  }
  //check that charity is not confirmed or pending or the account not freezed
  if (
    chariyIsExist.isConfirmed === false ||
    chariyIsExist.isPending === true ||
    chariyIsExist.isEnabled === false
  ) {
    throw new BadRequestError(
      'charity is not completed its authentication stages'
    );
  }
  if (
    chariyIsExist.emailVerification.isVerified === false &&
    chariyIsExist.phoneVerification.isVerified === false
  ) {
    throw new BadRequestError(
      'charity is not verified..must verify the account by email or phone number'
    );
  }
  if (caseIsExist.charity.toString() !== charityId.toString()) {
    //to check that the case is related to the charity id in the database
    throw new BadRequestError('mismatching while donating ...please try again');
  }
  //check the case is finished or being freezed by the website admin
  if (caseIsExist.finished === true || caseIsExist.freezed === true) {
    throw new BadRequestError(
      'this case is finished...choose case not completed'
    );
  }
  //check that donor only donates with the remain part of money and not exceed the target amount
  const checker = transactionUtils.donationAmountAssertion(caseIsExist, amount);
  return checker;
  // const currentAmount = +caseIsExist.currentDonationAmount + +amount;
  // if (
  //   +caseIsExist.targetDonationAmount < currentAmount &&
  //   caseIsExist.targetDonationAmount !== currentAmount
  // ) {
  //   throw new BadRequestError(
  //     'please donate with the remained value which is ' +
  //       (+caseIsExist.targetDonationAmount - +caseIsExist.currentDonationAmount)
  //   );
  // }
};
const updateCaseInfo = asyncHandler(async (data) => {
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
  const caseIsExist = await transactionRepository.findCaseById(items[0].name); //the id of the case

  if (!caseIsExist) {
    throw new NotFoundError('case is not found');
  }
  // implement the refund here
  const queryObj = {
    externalTransactionId: externalTransactionId,
    orderId: orderId,
  };

  const transactionIsExist = await transactionRepository.findTransactionByQuery(
    queryObj
  );
  if (transactionIsExist) {
    //transaction must updated not created again
    console.log('transaction updated partially in db be refunded');
    const caseId = transactionIsExist.case; //get the id of the case
    if (!caseId) throw new NotFoundError('case id not found');
    let caseIsExist = await transactionRepository.findCaseById(caseId);
    if (!caseIsExist) throw new NotFoundError('case id not found');

    await transactionUtils.updateTransactionForRefund(transactionIsExist);
    //update the case and decrement donation info
    await transactionUtils.updateTransactionAfterRefund(caseIsExist, amount);
    //in the next middleware will update the externalTransactionId with the new refund transaction

    return { transactionIsExist: transactionIsExist };
  } else {
    // console.log('no transaction found for refund so will create new one');
  }
  //what if status = pending?

  //update the case info
  //check if that is the last donation to finish this case
  caseIsExist = transactionUtils.checkIsLastDonation(caseIsExist, amount);
  caseIsExist = transactionUtils.updateCaseAfterDonation(caseIsExist, amount);

  let userIsExist = await transactionRepository.findUserByEmail(user.email);
  if (!userIsExist) throw new BadRequestError('no user found');
  //now everything is ready for creating the transaction

  // according to it we know the type of the payment method the donor paid with
  let paymentMethod;
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
  // try {
  const transactionData = {
    case: caseIsExist._id,
    user: userIsExist._id,
    moneyPaid: +amount,
    paidAt: date,
    externalTransactionId: externalTransactionId,
    orderId: orderId,
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
    newTransaction._id
  );
  if (status == 'failed') {
    return newTransaction;
    // throw new BadRequestError('transaction failed please try again');
  }
  await caseIsExist.save();
  await transactionUtils.confirmSavingCase();
  console.log({ status: newTransaction.status, data: newTransaction });

  return newTransaction;
  // } catch (err) {
  //   console.log(err);
  // }
});
const getAllTransactions = async (user) => {
  const transactionPromises = user.transactions.map(async (item, index) => {
    const myTransaction = await Transactions.findById(item);
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
  const allTransactions = await Promise.all(transactionPromises);
  await user.save();
  return allTransactions;
};
export const transactionService = {
  preCreateTransaction,
  getAllTransactions,
  updateCaseInfo,
};
