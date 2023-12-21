import asyncHandler from 'express-async-handler';
import { getTransactionByIdService } from '../admin/getTransactionById.service.js';
import { BadRequestError } from '../../errors/index.js';

const refund = async (transaction_id) => {
  try {
    const stepOneToken = await getTransactionByIdService.getTokenStepOne();
    const data = await getTransactionByIdService.getTransactionInfo(
      stepOneToken,
      transaction_id
    );
    const { id, amount_cents, success, pending } = data;
    //maybe should ? check the transaction also in the dataBase for the order id and transaction id
    if (success !== true || pending === true)
      throw new BadRequestError(
        'the transaction is not succedded ..cant refund it'
      );
    const request = await fetch(
      'https://accept.paymob.com/api/acceptance/void_refund/refund',
      {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auth_token: stepOneToken,
          transaction_id: id,
          amount_cents: amount_cents,
        }),
      }
    );
    const response = await request.json();
    return response;
  } catch (error) {
    throw new Error(error);
  }
};

export const refundService = { refund };
