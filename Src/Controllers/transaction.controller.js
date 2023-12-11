import asyncHandler from 'express-async-handler';
import { BadRequestError } from '../errors/index.js';

import { transactionService } from '../services/transaction.service.js';
const createTransaction = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  const data = req.body;
  // const transaction = await transactionService.createTransaction(
  //   data,
  //   req.user
  // );
  // if (!transaction) {
  //   throw new BadRequestError(
  //     'transaction not completed ... please try again!'
  //   );
  // }
  const transaction = await transactionService.createTransaction(
    data,
    req.user
  );
  if (!transaction) {
    throw new BadRequestError(
      'transaction not completed ... please try again!'
    );
  }
  // res.status(201).json({ status: 'success', data: transaction });
  next();
});
const getAllTransactions = asyncHandler(async (req, res, next) => {
  const myTransactions = await transactionService.getAllTransactions(req.user);
  if (!myTransactions) {
    throw new BadRequestError('no transactions found');
  }
  res.status(201).json({ status: 'success', data: myTransactions });
});

export { createTransaction, getAllTransactions };
