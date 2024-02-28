import { ITransaction } from './transaction.interface';
import { CaseDocument } from '../../../case/data-access/interfaces/case.interface';
import { CharityDocument } from '../../../charity/data-access/interfaces/charity.interface';
import { IUser } from '../../../user/data-access/interfaces/user.interface';
export interface TransactionDataStore {
  findCaseById(id: string): Promise<CaseDocument | undefined>;
  findCharityById(id: string): Promise<CharityDocument | undefined>;
  findTransactionByQuery(queryObj): Promise<ITransaction | undefined>;
  findTransactionById(id: string): Promise<ITransaction | undefined>;
  findUserByEmail(email: string): Promise<IUser | undefined>;
  createTransaction(
    transaction: Partial<ITransaction>
  ): Promise<ITransaction | undefined>;
}
