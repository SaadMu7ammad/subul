import { NextFunction, Response } from 'express';
import { OnlineCardService } from './onlineCards.service';
import { AuthedRequest } from '../../../../components/auth/user/data-access/auth.interface';
import { IPaymentInfoData } from '../payment.interface';
import { IUserDocument } from '../../../../components/user/data-access/interfaces/user.interface';
const payWithOnlineCard = async (
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) => {
  const {
    amount,
    charityId,
    caseId,
    caseTitle,
  }: {
    amount: number;
    charityId: string;
    caseId: string;
    caseTitle: string;
  } = req.body;
  const storedUser = req.user;
  const data: IPaymentInfoData = {
    amount,
    charityId,
    caseId,
    caseTitle,
  };
  const payInitResponse = await OnlineCardService.payWithOnlineCard(
    data,
    storedUser || ({} as IUserDocument)
  );

  return {
    orderId: payInitResponse.orderId,
    data: payInitResponse.data,
  };
};

export { payWithOnlineCard };
