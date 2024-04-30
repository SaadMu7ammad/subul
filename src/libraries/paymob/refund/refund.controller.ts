import { NextFunction, Request, Response } from 'express';
import { refundService } from './refund.service';
import { NotFoundError } from '../../errors/components';

const refund = (async (req:Request, res:Response, next:NextFunction) => {
  const { id } = req.params;
  if (!id) throw new NotFoundError('id for transaction not added')
  
  const response = await refundService.refund(id);
  return { response };
});

export { refund };
