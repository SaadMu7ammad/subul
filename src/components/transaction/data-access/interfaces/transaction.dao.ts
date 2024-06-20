import { ICase } from '@components/case/data-access/interfaces/case.interface';
import { ICharity } from '@components/charity/data-access/interfaces/charity.interface';
import { IUser } from '@components/user/data-access/interfaces';

import { ITransaction } from '.';

export interface TransactionDataStore {
  findCaseById(id: string): Promise<ICase | null>;
  findCharityById(id: string): Promise<ICharity | null>;
  findTransactionByQuery(queryObj: {
    externalTransactionId: string;
    orderId: string;
  }): Promise<ITransaction | null>;
  findTransactionById(id: string): Promise<ITransaction | null>;
  findUserByEmail(email: string): Promise<IUser | null>;
  createTransaction(transaction: ITransaction): Promise<ITransaction | null>;
}
