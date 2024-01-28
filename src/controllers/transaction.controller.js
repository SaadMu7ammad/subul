import asyncHandler from 'express-async-handler';
import { BadRequestError } from '../errors/index.js';

import { transactionService } from '../services/transaction.service.js';
const preCreateTransaction = asyncHandler(async (req, res, next) => {
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
});
const getAllTransactions = async (req, res, next) => {
  const myTransactions = await transactionService.getAllTransactions(req.user);
  if (!myTransactions) {
    throw new BadRequestError('no transactions found');
  }
  return { status: 'success', data: myTransactions };
};
const updateCaseInfo = asyncHandler(async (req, res, next) => {
  try {
    // console.log(req.body);
    // console.log(req.body.obj.id); //transaction id 150168430
    // console.log(req.body.obj.order.id); //order id 170836754
    // console.log(req.body.obj.order.items); //cases u provided in stage 2
    // console.log(req.body.obj.order.merchant); //subul org data
    // console.log(req.body.obj.order.shipping_data); //donor data
    // console.log(req.body.obj.order.currency);
    // console.log(req.body.obj.created_at);
    // console.log(req.body.obj.order.created_at);
    // console.log(req.body.obj.data.created_at); //real payment time
    // console.log(req.body.obj.amount_cents / 100);
    // console.log(req.body.obj.payment_key_claims.billing_data);
    // req.body.obj.source_data.type =card or wallet
    //req.body.obj.source_data.sub_type= MasterCard or wallet

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
    res.status(201).json({ status: transaction.status, data: transaction });
  } catch (err) {
    console.log(err);
  }
});

export { preCreateTransaction, getAllTransactions, updateCaseInfo };
