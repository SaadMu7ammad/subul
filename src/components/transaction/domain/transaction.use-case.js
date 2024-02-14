import asyncHandler from 'express-async-handler';
import { BadRequestError } from '../libraries/errors/components/index.js';

import { transactionService } from '../services/transaction.service.js';
const preCreateTransaction = async (req, res, next) => {
  const data = req.body;
  const transaction = await transactionService.preCreateTransaction(
    data,
    req.user
  );
  if (!transaction) {
    throw new BadRequestError(
      'transaction not completed ... please try again!'
    );
  }
  next();
};
const getAllTransactions = async (req, res, next) => {
  const myTransactions = await transactionService.getAllTransactions(req.user);
  if (!myTransactions) {
    throw new BadRequestError('no transactions found');
  }
  return { status: 'success', data: myTransactions };
};
const updateCaseInfo = async (req, res, next) => {
  // try {
  //ensure that transaction is not pending
  const data = {
    user: {
      ...req.body.obj.order.shipping_data,
    },
    items: {
      ...req.body.obj.order.items,
    },
    externalTransactionId: req.body.obj.id,
    orderId: req.body.obj.order.id,
    amount: req.body.obj.amount_cents / 100,
    date: req.body.obj.created_at,
    paymentMethodType: req.body.obj.source_data.type, //+","+req.body.source_data.sub_type
    status: req.body.obj.pending
      ? 'pending'
      : req.body.obj.success
      ? 'success'
      : 'failed',
    currency: req.body.obj.order.currency,
    secretInfoPayment: req.body.obj.source_data.pan,
  };
  // create a new transaction here
  //before update the case info check if the transaction is a refund or payment donation
  const transaction = await transactionService.updateCaseInfo(data);
  if (!transaction) {
    throw new BadRequestError(
      'transaction not completed ... please try again!'
    );
  }
  return { status: transaction.status, data: transaction };
  // } catch (err) {
  //     console.log(err);
  // }
};

export { preCreateTransaction, getAllTransactions, updateCaseInfo };
