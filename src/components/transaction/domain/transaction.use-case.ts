import { BadRequestError } from '../../../libraries/errors/components/index.js';
import { Transaction } from '../data-access/interfaces/transaction.interface.js';

import { transactionService } from './transaction.service.js';
const preCreateTransaction = async (req, res, next) => {
  try {
    const data = req.body;
    const storedUser = req.user;
    const transaction: boolean = await transactionService.preCreateTransaction(
      data,
      storedUser
    );
    if (!transaction) {
      throw new BadRequestError(
        'transaction not completed ... please try again!'
      );
    }
    next();
  } catch (err) {
    next(err);
  }
};
const getAllTransactions = async (req, res, next) => {
  const myTransactions: { allTransactions: Transaction[] } =
    await transactionService.getAllTransactions(req.user);
  if (!myTransactions) {
    throw new BadRequestError('no transactions found');
  }
  return { status: 'success', data: myTransactions };
};
const updateCaseInfo = async (req, res, next) => {
  try {
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
    const transaction: Transaction | undefined =
      await transactionService.updateCaseInfo(data);
    if (!transaction) {
      throw new BadRequestError(
        'transaction not completed ... please try again!'
      );
    }
    return { status: transaction.status, data: transaction };
  } catch (err) {
    console.log(err);
  }
};

export { preCreateTransaction, getAllTransactions, updateCaseInfo };
