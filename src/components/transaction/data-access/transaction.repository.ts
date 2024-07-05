import { ICase } from '@components/case/data-access/interfaces/case.interface';
import CaseModel from '@components/case/data-access/models/case.model';
import { ICharity } from '@components/charity/data-access/interfaces';
import CharityModel from '@components/charity/data-access/models/charity.model';
import { IUser } from '@components/user/data-access/interfaces';
import UserModel from '@components/user/data-access/models/user.model';
import { FilterQuery } from 'mongoose';

import { ITransaction } from './interfaces';
import { TransactionDataStore } from './interfaces/transaction.dao';
import TransactionModel from './models/transaction.model';

class TransactionRepository implements TransactionDataStore {
  async findCaseById(id: string): Promise<ICase | null> {
    const cases = await CaseModel.findById(id);
    return cases;
  }

  async findCharityById(id: string): Promise<ICharity | null> {
    const charity = await CharityModel.findById(id);
    return charity;
  }
  async findTransactionByQuery(queryObj: FilterQuery<ITransaction>): Promise<ITransaction | null> {
    const transaction = await TransactionModel.findOne(queryObj);
    return transaction;
  }
  async findTransactionsByQuery(
    queryObj: FilterQuery<ITransaction>
  ): Promise<ITransaction[] | null> {
    const transactions = await TransactionModel.find(queryObj);
    return transactions;
  }
  async findTransactionById(id: string): Promise<ITransaction | null> {
    const transaction = await TransactionModel.findOne({
      _id: id,
    })
      .populate('charity', 'name')
      .populate('user', 'name');
    return transaction;
  }
  async findUserByEmail(email: string): Promise<IUser | null> {
    const user = await UserModel.findOne({
      email: email,
    });
    return user;
  }
  async createTransaction(transaction: Partial<ITransaction>): Promise<ITransaction | null> {
    const newTransaction = await TransactionModel.create(transaction);
    return newTransaction;
  }
}
export class TRANSACTION {
  public transactionModel = new TransactionRepository();

  constructor() {
    // super();
  }
}
