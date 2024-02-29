import Charity from '../../charity/data-access/models/charity.model.js';
import User from '../../user/data-access/models/user.model.js';
import Case from '../../case/data-access/models/case.model.js';
import { NotFoundError } from '../../../libraries/errors/components/not-found.js';
import { ITransaction } from './interfaces/transaction.interface.js';
import { Promise, FilterQuery } from 'mongoose';
import { TransactionDataStore } from './interfaces/transaction.dao.js';
import TransactionModel from './models/transaction.model.js';
import { CaseDocument } from '../../case/data-access/interfaces/case.interface.js';
import { ICharityDocument } from '../../charity/data-access/interfaces/charity.interface.js';
import { IUser } from '../../user/data-access/interfaces/user.interface.js';
export class TransactionRepository implements TransactionDataStore {
    async findCaseById(id: string): Promise<CaseDocument | null> {
        const cases = await Case.findById(id);
        return cases;
    }

    async findCharityById(id: string): Promise<ICharityDocument | null> {
        const charity = await Charity.findById(id);
        return charity;
    }
    async findTransactionByQuery(
        queryObj: FilterQuery<Partial<ITransaction>>
    ): Promise<ITransaction | null> {
        const transaction = await TransactionModel.findOne(queryObj);
        return transaction;
    }
    async findTransactionById(id: string): Promise<ITransaction | null> {
        const transaction = await TransactionModel.findOne({ _id: id });
        return transaction;
    }
    async findUserByEmail(email: string): Promise<IUser | null> {
        const user = await User.findOne({ email: email });
        return user;
    }
    async createTransaction(
        transaction: Partial<ITransaction>
    ): Promise<ITransaction | null> {
        const newTransaction = await TransactionModel.create(transaction);
        return newTransaction;
    }
}
