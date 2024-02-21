import { Transaction } from './transaction.interface';
import { Promise } from 'mongoose';
export interface TransactionDataStore {
  findCaseById(id: string): Promise<Case | undefined>;
  findCharityById(id: string): Promise<Charity | undefined>;
  findTransactionByQuery(queryObj): Promise<Transaction | undefined>;
  findTransactionById(id: string): Promise<Transaction | undefined>;
  findUserByEmail(email: string): Promise<User | undefined>;
  createTransaction(
    transaction: Partial<Transaction>
  ): Promise<Transaction | undefined>;
}
