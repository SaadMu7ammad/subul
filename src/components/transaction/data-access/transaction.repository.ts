import Charity from '../../charity/data-access/models/charity.model.js';
import User from '../../user/data-access/models/user.model.js';
import Case from '../../case/data-access/models/case.model.js';
import Transaction from './models/transaction.model.js';
import { NotFoundError } from '../../../libraries/errors/components/not-found.js';
import { TransactionDocument } from '../../../interfaces/transaction.interface.js';
const findCaseById = async (id:string) => {
  const cases = await Case.findById(id);
  if(!cases) throw new NotFoundError('case not found');
  return cases;
};

const findCharityById = async (id:string) => {
  const charity = await Charity.findById(id);
  if(!charity) throw new NotFoundError('charity not found');
  return charity;
};
const findTransactionByQuery = async (queryObj):Promise<TransactionDocument>=> {
  const transaction= await Transaction.findOne(queryObj);
  if(!transaction) throw new NotFoundError('transaction not found');
  return transaction;
};
const findTransactionById = async (id:string):Promise<TransactionDocument> => {
  const transaction = await Transaction.findOne({ _id: id });
  if(!transaction) throw new NotFoundError('transaction not found');
  return transaction;
};
const findUserByEmail = async (email:string) => {
  const user = await User.findOne({ email: email });
  if(!user) throw new NotFoundError('user not found');
  return user;
};
const createTransaction = async (transaction):Promise<TransactionDocument> => {
  const newTransaction = await Transaction.create(transaction);
  return newTransaction;
};
export const transactionRepository = {
  findCharityById,
  findCaseById,
  findTransactionByQuery,
  findUserByEmail,
  createTransaction,
  findTransactionById,
};
