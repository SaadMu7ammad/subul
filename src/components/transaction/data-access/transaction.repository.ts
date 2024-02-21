import Charity from '../../charity/data-access/models/charity.model.js';
import User from '../../user/data-access/models/user.model.js';
import Case from '../../case/data-access/models/case.model.js';
import { NotFoundError } from '../../../libraries/errors/components/not-found.js';
import { Transaction } from './interfaces/transaction.interface.js';
import { Promise, FilterQuery } from 'mongoose';
import { TransactionDataStore } from './interfaces/transaction.dao.js';
import TransactionModel from './models/transaction.model.js';

export class TransactionRepository implements TransactionDataStore {
  async findCaseById(id: string) {
    const cases = await Case.findById(id);
    if (!cases) throw new NotFoundError('case not found');
    return cases;
  }

  async findCharityById(id: string) {
    const charity = await Charity.findById(id);
    if (!charity) throw new NotFoundError('charity not found');
    return charity;
  }
  async findTransactionByQuery(
    queryObj: FilterQuery<Partial<Transaction>>
  ): Promise<Transaction | undefined> {
    const transaction = await TransactionModel.findOne(queryObj);
    if (!transaction) throw new NotFoundError('transaction not found');
    return transaction;
  }
  async findTransactionById(id: string): Promise<Transaction | undefined> {
    const transaction = await TransactionModel.findOne({ _id: id });
    if (!transaction) throw new NotFoundError('transaction not found');
    return transaction;
  }
  async findUserByEmail(email: string) {
    const user = await User.findOne({ email: email });
    if (!user) throw new NotFoundError('user not found');
    return user;
  }
  async createTransaction(
    transaction: Partial<Transaction>
  ): Promise<Transaction | undefined> {
    const newTransaction = await TransactionModel.create(transaction);
    return newTransaction;
  }
}
