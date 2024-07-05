import { ICase } from '@components/case/data-access/interfaces/case.interface';
import { ICharity } from '@components/charity/data-access/interfaces/charity.interface';
import { transactionServiceClass } from '@components/transaction/domain/transaction.service';
import { IUser } from '@components/user/data-access/interfaces';
import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { FilterQuery } from 'mongoose';

import {
  GetAllTransactionResponse,
  IDataPreCreateTransaction,
  IDataUpdateCaseInfo,
  ITransaction,
  UpdateCaseInfoResponse,
} from '.';

export interface TransactionDataStore {
  findCaseById(id: string): Promise<ICase | null>;
  findCharityById(id: string): Promise<ICharity | null>;
  findTransactionByQuery(queryObj: {
    externalTransactionId: string;
    orderId: string;
  }): Promise<ITransaction | null>;
  findTransactionById(id: string): Promise<ITransaction | null>;
  findAllTransactions(): Promise<ITransaction[]>;
  findTransactionsByQuery(queryObj: FilterQuery<ITransaction>): Promise<ITransaction[] | null>;
  findUserByEmail(email: string): Promise<IUser | null>;
  createTransaction(transaction: ITransaction): Promise<ITransaction | null>;
}

export interface transactionServiceSkeleton {
  preCreateTransactionService(data: IDataPreCreateTransaction, user: IUser): Promise<boolean>;
  updateCaseInfo(data: IDataUpdateCaseInfo): Promise<ITransaction | null>;
  getAllTransactions(user: IUser): Promise<{ allTransactions: (ITransaction | null)[] }>;
}

export interface transactionUseCaseSkeleton {
  transactionService: transactionServiceClass;

  preCreateTransaction(req: Request, res: Response, next: NextFunction): Promise<void>;

  getAllTransactions(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<GetAllTransactionResponse>;

  updateCaseInfo(req: Request, res: Response, next: NextFunction): Promise<UpdateCaseInfoResponse>;
}
export interface transactionUtilsSkeleton {
  checkPreCreateTransaction(data: IDataPreCreateTransaction): Promise<void>;
  checkCharityIsValidToDonate(charity: ICharity): Promise<void>;
  checkCaseIsValidToDonate(cause: ICase): Promise<void>;
  donationAmountAssertion(cause: ICase, amount: number): Promise<boolean>;
  updateTransactionAfterRefund(transaction: ITransaction): Promise<void>;
  updateCaseAfterRefund(cause: ICase, amount: number): Promise<void>;
  checkIsLastDonation(cause: ICase, amount: number): ICase;
  updateCaseAfterDonation(cause: ICase, amount: number): ICase;
  getAllTransactionsToCharity(cause: string, charity: ICharity): Promise<ITransaction[] | null>;

  addTransactionIdToUserTransactionIds(
    user: IUser,
    newTransactionId: Types.ObjectId
  ): Promise<IUser>;
  confirmSavingCase(cause: ICase): Promise<void>;
  confirmSavingUser(user: IUser): Promise<void>;

  getAllTransactionsPromised(user: IUser): Promise<(ITransaction | null)[]>;
  refundUtility(transaction: ITransaction, amount: number): Promise<ITransaction>;

  addDonorNameAndCharityNameToTransactions(transactions: ITransaction[]): Promise<void>;
}
