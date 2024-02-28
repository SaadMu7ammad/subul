import { ITransaction } from './transaction.interface';
import { CaseDocument } from '../../../case/data-access/interfaces/case.interface';
import { CharityDocument } from '../../../charity/data-access/interfaces/charity.interface';
import { IUser } from '../../../user/data-access/interfaces/user.interface';
export interface TransactionDataStore {
  findCaseById(id: string): Promise<CaseDocument | null>;
  findCharityById(id: string): Promise<CharityDocument | null>;
  findTransactionByQuery(queryObj): Promise<ITransaction | null>;
  findTransactionById(id: string): Promise<ITransaction | null>;
  findUserByEmail(email: string): Promise<IUser | null>;
  createTransaction(
    transaction: Partial<ITransaction>
  ): Promise<ITransaction | null>;
}
