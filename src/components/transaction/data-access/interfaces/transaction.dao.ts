import { ITransaction, ITransactionDocument } from './transaction.interface';
import { ICaseDocument } from '../../../case/data-access/interfaces/case.interface';
import { ICharityDocument } from '../../../charity/data-access/interfaces/charity.interface';
import {  IUserDocument } from '../../../user/data-access/interfaces/user.interface';
export interface TransactionDataStore {
    findCaseById(id: string): Promise<ICaseDocument | null>;
    findCharityById(id: string): Promise<ICharityDocument | null>;
    findTransactionByQuery(queryObj:any): Promise<ITransactionDocument | null>;
    findTransactionById(id: string): Promise<ITransactionDocument | null>;
    findUserByEmail(email: string):Promise<IUserDocument | null>;
    createTransaction(
        transaction: ITransaction
    ): Promise<ITransactionDocument | null>;
}
