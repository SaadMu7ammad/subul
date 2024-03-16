import { NextFunction,  Request,  Response } from 'express';
import { OnlineCardService } from './onlineCards.service';
import { IPaymentInfoData } from '../payment.interface';
const payWithOnlineCard = async (
    req: Request,
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
    const storedUser =  res.locals.user;
    const data: IPaymentInfoData = {
        amount,
        charityId,
        caseId,
        caseTitle,
    };
    const payInitResponse = await OnlineCardService.payWithOnlineCard(
        data,
        storedUser
    );

    return {
        orderId: payInitResponse.orderId,
        data: payInitResponse.data,
    };
};

export { payWithOnlineCard };
