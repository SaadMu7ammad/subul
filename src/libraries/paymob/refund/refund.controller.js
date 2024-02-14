import asyncHandler from 'express-async-handler';
import { getTransactionByIdService } from '../admin/getTransactionById.service.js';
import { BadRequestError } from '../../errors/components/index.js';
import { refundService } from './refund.service.js';

const refund = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const response = await refundService.refund(id);
  res.status(201).json(response);
});

export { refund };
