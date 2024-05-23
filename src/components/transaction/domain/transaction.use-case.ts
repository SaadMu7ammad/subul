import {
  IDataPreCreateTransaction,
  IDataUpdateCaseInfo,
} from '@components/transaction/data-access/interfaces';
import {
  GetAllTransactionResponse,
  ITransaction,
  UpdateCaseInfoResponse,
} from '@components/transaction/data-access/interfaces';
import { User } from '@components/user/data-access/interfaces';
import { BadRequestError } from '@libs/errors/components/index';
import { NextFunction, Request, Response } from 'express';

import { transactionService } from './transaction.service';

const preCreateTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { charityId, caseId, amount, mainTypePayment } = req.body;

    const data: IDataPreCreateTransaction = { charityId, caseId, amount, mainTypePayment };

    const storedUser: User = res.locals.user;

    const transaction: boolean = await transactionService.preCreateTransaction(data, storedUser);

    if (!transaction) {
      throw new BadRequestError('transaction not completed ... please try again!');
    }

    next();
  } catch (err) {
    next(err);
  }
};

const getAllTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<GetAllTransactionResponse> => {
  const myTransactions: { allTransactions: (ITransaction | null)[] } =
    await transactionService.getAllTransactions(res.locals.user);

  if (!myTransactions) {
    throw new BadRequestError('no transactions found');
  }

  return { status: 'success', data: myTransactions };
};

const updateCaseInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<UpdateCaseInfoResponse> => {
  try {
    //ensure that transaction is not pending
    const data: IDataUpdateCaseInfo = {
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
      status: req.body.obj.pending ? 'pending' : req.body.obj.success ? 'success' : 'failed',
      currency: req.body.obj.order.currency,
      secretInfoPayment: req.body.obj.source_data.pan,
    };

    // create a new transaction here
    //before update the case info check if the transaction is a refund or payment donation
    const transaction = await transactionService.updateCaseInfo(data);

    if (!transaction) {
      throw new BadRequestError('transaction not completed ... please try again!');
    }

    return { status: transaction.status, data: transaction };
  } catch (err) {
    console.log(err);
  }
};

export { preCreateTransaction, getAllTransactions, updateCaseInfo };
