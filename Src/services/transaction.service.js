import asyncHandler from 'express-async-handler';
import Cases from '../models/caseModel.js';
import Transactions from '../models/transactionModel.js';
import { NotFoundError } from '../errors';
const createTransaction = asyncHandler(async (data) => {
  const { caseId, donationAmount } = data;
  if (donationAmount === 0) {
    throw new BadRequestError('Invalid amount of donation');
  }
  const caseIsExist = await Cases.findById(caseId);
  if (!caseIsExist) {
    throw new NotFoundError('case is not founded');
  }
  //check the case is finished or being freezed by the website admin
  if (caseIsExist.finished === true || caseIsExist.freezed === true) {
    throw new BadRequestError(
      'this case is finished...choose not completed one'
    );
  }
    const transaction = await Transactions.create
    ({})
  return data;
});

export { createTransaction };
