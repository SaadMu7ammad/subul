import { NextFunction, Request, Response } from 'express';
import { OnlineCardService } from './onlineCards.service.js';
import { authedRequest } from '../../../../components/auth/user/data-access/auth.interface.js';
import { IPaymentInfoData } from '../payment.interface.js';
const payWithOnlineCard = async (req:authedRequest, res:Response, next:NextFunction) => {
  const { amount, charityId, caseId, caseTitle }:{amount:number, charityId:string, caseId:string, caseTitle:string} = req.body;
  const storedUser = req.user;
  const data:IPaymentInfoData = {
    amount,
    charityId,
    caseId,
    caseTitle,
  };
  const payInitResponse = await OnlineCardService.payWithOnlineCard(data, storedUser);

  return {
    orderId: payInitResponse.orderId,
    data: payInitResponse.data,
  };
};

export { payWithOnlineCard };
