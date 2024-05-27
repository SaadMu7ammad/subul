import { NotFoundError } from '@libs/errors/components';
import { RequestHandler } from 'express';

import { getTransactionByIdService } from './getTransactionById.service';

const getTransactionById: RequestHandler = async (req, res, next) => {
  const { id } = req.params; //transaction_id
  if (!id) throw new NotFoundError('id for transaction not added');
  const token: string = await getTransactionByIdService.getTokenStepOne();
  const data = await getTransactionByIdService.getTransactionInfo(token, id);
  // const { transactionId, amount_cents, success, pending } = data;
  return { data };
  // res.status(201).json({
  //   transactionId,
  //   amount_cents,
  //   success,
  //   pending,
  // });
};
export { getTransactionById };
