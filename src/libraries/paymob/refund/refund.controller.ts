import { NextFunction, Request, Response } from 'express';
import { refundService } from './refund.service';

const refund = (async (req:Request, res:Response, next:NextFunction) => {
  const {id} = req.params;
  const response = await refundService.refund(id);
  return { response };
});

export { refund };
