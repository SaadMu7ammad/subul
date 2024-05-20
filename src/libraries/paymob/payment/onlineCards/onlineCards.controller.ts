import { NextFunction, Request, Response } from 'express';

import { IPaymentInfoData } from '../payment.interface';
import { OnlineCardService } from './onlineCards.service';

const payWithOnlineCard = async (req: Request, res: Response, next: NextFunction) => {
  const { amount, charityId, caseId, caseTitle }: IPaymentInfoData = req.body;
  const storedUser = res.locals.user;
  const data: IPaymentInfoData = {
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
