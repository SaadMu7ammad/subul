import asyncHandler from 'express-async-handler';
import { getTransactionByIdService } from '../admin/getTransactionById.service.js';
import { BadRequestError, NotFoundError } from '../../errors/index.js';
import Transaction from '../../models/transactionModel.js';
const refund = async (transaction_id) => {
  try {
    const stepOneToken = await getTransactionByIdService.getTokenStepOne();
    const data = await getTransactionByIdService.getTransactionInfo(
      stepOneToken,
      transaction_id
    );
    const { id, amount_cents, success, pending } = data;
    const orderId = data.order.id;
    //a solution indexing for the transaction table on externalTransactionId
    const transactionIsExist = await Transaction.findOne({
      externalTransactionId: transaction_id,
    });
    if (!transactionIsExist)
      throw new NotFoundError('transaction not stored in db');

    if (orderId.toString() !== transactionIsExist.orderId) {
      throw new BadRequestError('conflict in the order id !');
    }
    if (amount_cents !== transactionIsExist.moneyPaid * 100) {
      throw new BadRequestError('conflict in the transaction amount paid !');
    }
    if (transactionIsExist.status === 'refunded') {
      throw new BadRequestError('status is already refunded ');
    }
    if (
      transactionIsExist.status !== 'success' ||
      success !== true ||
      pending === true
    ) {
      throw new BadRequestError('status is not succedded or still pending ');
    }
    if (success !== true || pending === true) {
      throw new BadRequestError(
        'the transaction is not succedded ..cant refund it'
      );
    }
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
