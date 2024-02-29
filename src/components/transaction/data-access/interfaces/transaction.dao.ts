import { ITransaction } from './transaction.interface';
import { ICaseDocument } from '../../../case/data-access/interfaces/case.interface';
import { ICharityDocument } from '../../../charity/data-access/interfaces/charity.interface';
import { IUser } from '../../../user/data-access/interfaces/user.interface';
export interface TransactionDataStore {
    findCaseById(id: string): Promise<ICaseDocument | null>;
    findCharityById(id: string): Promise<ICharityDocument | null>;
    findTransactionByQuery(queryObj): Promise<ITransaction | null>;
    findTransactionById(id: string): Promise<ITransaction | null>;
    findUserByEmail(email: string): Promise<IUser | null>;
    createTransaction(
        transaction: Partial<ITransaction>
    ): Promise<ITransaction | null>;
}
