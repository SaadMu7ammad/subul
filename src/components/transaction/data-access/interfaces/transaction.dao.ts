import { ITransaction } from '.';
import { ICase } from '../../../case/data-access/interfaces/case.interface';
import { ICharity } from '../../../charity/data-access/interfaces/charity.interface';
import { User } from '../../../user/data-access/interfaces';

export interface TransactionDataStore {
  findCaseById(id: string): Promise<ICase | null>;
  findCharityById(id: string): Promise<ICharity | null>;
  findTransactionByQuery(queryObj: any): Promise<ITransaction | null>;
  findTransactionById(id: string): Promise<ITransaction | null>;
  findUserByEmail(email: string): Promise<User | null>;
  createTransaction(transaction: ITransaction): Promise<ITransaction | null>;
}
