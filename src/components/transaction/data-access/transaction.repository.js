import Charity from '../../charity/data-access/models/charity.model.js';
import User from '../../user/data-access/models/user.model.js';
import Case from '../../case/data-access/models/case.model.js';
import Transaction from './models/transactionModel.js';

const findCaseById = async (id) => {
  const cases = await Case.findById({ id: id });
  return cases;
};

const findCharityById = async (id) => {
  const charity = await Charity.findById({ id: id });
  return charity;
};
const findTransactionByQuery = async (queryObj) => {
  const transaction = await Transaction.findOne(queryObj);
  return transaction;
};
const findUserByEmail = async (email) => {
  const user = await User.findOne(email);
  return user;
};
const createTransaction = async (transaction) => {
  const newTransaction = await Transaction.create(transaction)
  return newTransaction;
}
export const transactionRepository = {
  findCharityById,
  findCaseById,
  findTransactionByQuery,
  findUserByEmail,createTransaction
};
