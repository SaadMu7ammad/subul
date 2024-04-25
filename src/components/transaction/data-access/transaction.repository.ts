import CharityModel from '../../charity/data-access/models/charity.model';
import UserModel, { User } from '../../user/data-access/models/user.model';
import CaseModel from '../../case/data-access/models/case.model';
import { FilterQuery } from 'mongoose';
import { TransactionDataStore } from './interfaces/transaction.dao';
import TransactionModel from './models/transaction.model';
import { ITransaction } from './interfaces';
import { ICase } from '../../case/data-access/interfaces/case.interface';
import { ICharity } from '../../charity/data-access/interfaces';

export class TransactionRepository implements TransactionDataStore {
  async findCaseById(id: string): Promise<ICase | null> {
    const cases = (await CaseModel.findById(id));
    return cases;
  }

  async findCharityById(id: string): Promise<ICharity | null> {
    const charity = (await CharityModel.findById(
      id
    ))
    return charity;
  }
  async findTransactionByQuery(
    queryObj: FilterQuery<ITransaction>
  ): Promise<ITransaction | null> {
    const transaction = (await TransactionModel.findOne(
      queryObj
    ));
    return transaction;
  }
  async findTransactionById(id: string): Promise<ITransaction | null> {
    const transaction = (await TransactionModel.findOne({
      _id: id,
    }))
    return transaction;
  }
  async findUserByEmail(email: string): Promise<User | null> {
    const user = (await UserModel.findOne({
      email: email,
    }))
    return user;
  }
  async createTransaction(
    transaction: Partial<ITransaction>
  ): Promise<ITransaction | null> {
    const newTransaction = (await TransactionModel.create(
      transaction
    ))
    return newTransaction;
  }
}
