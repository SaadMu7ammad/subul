import CharityModel from '../../charity/data-access/models/charity.model';
import UserModel from '../../user/data-access/models/user.model';
import CaseModel from '../../case/data-access/models/case.model';
import {
  ITransaction,
  ITransactionDocument,
} from './interfaces/transaction.interface';
import { FilterQuery } from 'mongoose';
import { TransactionDataStore } from './interfaces/transaction.dao';
import TransactionModel from './models/transaction.model';
import { ICaseDocument } from '../../case/data-access/interfaces/case.interface';
import { ICharityDocument } from '../../charity/data-access/interfaces/charity.interface';
import { IUserDocument } from '../../user/data-access/interfaces/user.interface';
export class TransactionRepository implements TransactionDataStore {
  async findCaseById(id: string): Promise<ICaseDocument | null> {
    const cases = (await CaseModel.findById(id)) as ICaseDocument | null;
    return cases;
  }

  async findCharityById(id: string): Promise<ICharityDocument | null> {
    const charity = (await CharityModel.findById(
      id
    )) as ICharityDocument | null;
    return charity;
  }
  async findTransactionByQuery(
    queryObj: FilterQuery<ITransaction>
  ): Promise<ITransactionDocument | null> {
    const transaction = (await TransactionModel.findOne(
      queryObj
    )) as ITransactionDocument | null;
    return transaction;
  }
  async findTransactionById(id: string): Promise<ITransactionDocument | null> {
    const transaction = (await TransactionModel.findOne({
      _id: id,
    })) as ITransactionDocument | null;
    return transaction;
  }
  async findUserByEmail(email: string): Promise<IUserDocument | null> {
    const user = (await UserModel.findOne({
      email: email,
    })) as IUserDocument | null;
    return user;
  }
  async createTransaction(
    transaction: ITransaction
  ): Promise<ITransactionDocument | null> {
    const newTransaction = (await TransactionModel.create(
      transaction
    )) as ITransactionDocument | null;
    return newTransaction;
  }
}
