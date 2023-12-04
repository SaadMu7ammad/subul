import asyncHandler from 'express-async-handler';
import { BadRequestError } from '../errors';

import { createTransaction } from '../services/transaction.service.js';
const createTransaction = asyncHandler(async(req, res, next) => {

    const data = req.body;
    const transaction = await createTransaction(data);

    if(!transaction){
        throw new BadRequestError('transaction not completed ... please try again!')
    }
    res.status(201).json({ status: 'success', data: transaction });
});

export { createTransaction };
