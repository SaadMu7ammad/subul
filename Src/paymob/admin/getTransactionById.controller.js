import asyncHandler from 'express-async-handler';
import { getTransactionByIdService } from './getTransactionById.service.js';

const getTransactionById = asyncHandler(async (req, res, next) => {
  const { id } = req.params; //transaction_id
  const token = await getTransactionByIdService.getTokenStepOne();
  const data = await getTransactionByIdService.getTransactionInfo(token, id);
  const { transactionId, amount_cents, success, pending } = data;
  return res.status(201).json(data);
  // return data;
  // res.status(201).json({
  //   transactionId,
  //   amount_cents,
  //   success,
  //   pending,
  // });
});
export { getTransactionById };
