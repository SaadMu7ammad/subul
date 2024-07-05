import {
  IDataPreCreateTransaction,
  IDataUpdateCaseInfo,
  transactionUseCaseSkeleton,
} from '@components/transaction/data-access/interfaces';
import {
  GetAllTransactionResponse,
  ITransaction,
  UpdateCaseInfoResponse,
} from '@components/transaction/data-access/interfaces';
import { IUser } from '@components/user/data-access/interfaces';
import { BadRequestError } from '@libs/errors/components/index';
import { NextFunction, Request, Response } from 'express';

import { transactionServiceClass } from './transaction.service';

export class tranactionUseCaseClass implements transactionUseCaseSkeleton {
  transactionService: transactionServiceClass;

  constructor() {
    // Initialize the private field in the constructor
    this.transactionService = new transactionServiceClass();
    // console.log(this.transactionService);
    // Bind the method to ensure 'this' refers to the class instance
    this.preCreateTransaction = this.preCreateTransaction.bind(this);
    this.getAllTransactions = this.getAllTransactions.bind(this);
    this.updateCaseInfo = this.updateCaseInfo.bind(this);
    this.getAllTransactionsToCharity = this.getAllTransactionsToCharity.bind(this);
  }
  async preCreateTransaction(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { charityId, caseId, amount, mainTypePayment } = req.body;

      const data: IDataPreCreateTransaction = { charityId, caseId, amount, mainTypePayment };

      const storedUser: IUser = res.locals.user;
      const transaction: boolean = await this.transactionService.preCreateTransactionService(
        data,
        storedUser
      );
      // console.log(this.#transactionService);

      if (!transaction) {
        throw new BadRequestError('transaction not completed ... please try again!');
      }

      next();
    } catch (err) {
      next(err);
    }
  }

  async getAllTransactions(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<GetAllTransactionResponse> {
    const myTransactions: { allTransactions: (ITransaction | null)[] } =
      await this.transactionService.getAllTransactions(res.locals.user);

    if (!myTransactions) {
      throw new BadRequestError('no transactions found');
    }

    return { status: 'success', data: myTransactions };
  }
  async getAllTransactionsToCharity(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<GetAllTransactionResponse> {
    const caseId: string = req.body.caseId;

    const myTransactions: { allTransactions: (ITransaction | null)[] } =
      await this.transactionService.getAllTransactionsToCharity(res.locals.charity, caseId);

    if (!myTransactions) {
      throw new BadRequestError('no transactions found');
    }

    return { status: 'success', data: myTransactions };
  }
  async updateCaseInfo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<UpdateCaseInfoResponse> {
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
      const transaction = await this.transactionService.updateCaseInfo(res, data);

      if (!transaction) {
        throw new BadRequestError('transaction not completed ... please try again!');
      }

      return { status: transaction.status, data: transaction };
    } catch (err) {
      console.log(err);
    }
  }
}
