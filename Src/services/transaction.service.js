import asyncHandler from 'express-async-handler';
import Case from '../models/caseModel.js';
import Transactions from '../models/transactionModel.js';
import { BadRequestError, NotFoundError } from '../errors/index.js';
const createTransaction = asyncHandler(async (data, user) => {
  const { caseId, moneyPaid, paymentMethod, name } = data;
  //pre processing
  if (!caseId) {
    throw new NotFoundError('id is not found');
  }
  if (!name) {
    throw new NotFoundError('data is not completed');
  }
  if (+moneyPaid === 0) {
    throw new BadRequestError('Invalid amount of donation');
  }
  if (!paymentMethod) {
    throw new NotFoundError('no payment method has been chosen');
  }
  if (
    !paymentMethod.bankAccount &&
    !paymentMethod.fawry &&
    !paymentMethod.vodafoneCash
  ) {
    throw new NotFoundError('no payment method has been chosen');
  }
  //   let paymentType;
  //   if (paymentMethod.bankAccount) paymentType = 'Bank';
  //   else if (paymentMethod.fawry) paymentType = 'fawry';
  //   else if (paymentMethod.vodafoneCash) paymentType = 'vodafoneCash';

  const caseIsExist = await Case.findById(caseId);
  if (!caseIsExist) {
    throw new NotFoundError('case is not found');
  }
  //check the case is finished or being freezed by the website admin
  if (caseIsExist.finished === true || caseIsExist.freezed === true) {
    throw new BadRequestError(
      'this case is finished...choose case not completed'
    );
  }

  const transaction = await Transactions.create({
    case: caseId,
    user: user._id,
    moneyPaid: +moneyPaid,
    paymentMethod: {
      name: name,
      ...paymentMethod,
    },
  });
  if (!transaction) throw new BadRequestError('no transaction found');
  //after transaction created we must update the case info

  //first..check that donor only donates with the remain part of money and not exceed the target amount
  const currentAmount = +caseIsExist.currentDonationAmount + +moneyPaid;
  if (
    +caseIsExist.targetDonationAmount < currentAmount &&
    caseIsExist.targetDonationAmount !== currentAmount
  ) {
    throw new BadRequestError(
      'please donate with the remained value which is ' +
        (+caseIsExist.targetDonationAmount - +caseIsExist.currentDonationAmount)
    );
  }
  //second..check if that is the last donation to finish this case
  if (+caseIsExist.targetDonationAmount === currentAmount) {
    caseIsExist.dateFinished = Date.now();
    caseIsExist.finished = true;
  }
  //update the case info
  +caseIsExist.dontationNumbers++;
  caseIsExist.currentDonationAmount += +moneyPaid;
  await caseIsExist.save();
  return { transaction };
});
export const transactionService = {
  createTransaction,
};
