import { ICase } from '../../../case/data-access/interfaces/case.interface';
import { ICharity } from '../../../charity/data-access/interfaces/charity.interface';
<<<<<<< HEAD
import { User } from '../../../user/data-access/interfaces';
import { ITransaction } from '../models/transaction.model';
=======
import { User } from '../../../user/data-access/models/user.model';
import { ITransaction } from '.';

>>>>>>> 5ba5c350bf43747b0a6ddf7e937ec3225f4e8e9e
export interface TransactionDataStore {
  findCaseById(id: string): Promise<ICase | null>;
  findCharityById(id: string): Promise<ICharity | null>;
  findTransactionByQuery(queryObj: any): Promise<ITransaction | null>;
  findTransactionById(id: string): Promise<ITransaction | null>;
  findUserByEmail(email: string): Promise<User | null>;
  createTransaction(
    transaction: ITransaction
  ): Promise<ITransaction | null>;
}
