import { TransactionDocument } from "./transaction.interface";

export interface TransactionDao{
    // findCharityById,
    // findCaseById,
    // findTransactionByQuery,
    // findUserByEmail,
    // createTransaction,
    findTransactionById:(id: string) => Promise<TransactionDocument>;
}