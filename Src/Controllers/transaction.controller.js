import asyncHandler from 'express-async-handler';
import { BadRequestError } from '../errors/index.js';

import { transactionService } from '../services/transaction.service.js';
const createTransaction = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  const data = req.body;
  const transaction = await transactionService.createTransaction(
    data,
    req.user
  );
  if (!transaction) {
    throw new BadRequestError(
      'transaction not completed ... please try again!'
    );
  }
  res.status(201).json({ status: 'success', data: transaction });
});

export { createTransaction };
