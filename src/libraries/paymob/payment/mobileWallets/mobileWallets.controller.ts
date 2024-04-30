import { NextFunction, Request, Response } from 'express';
import { mobileWalletService } from './mobileWallets.service';
const paywithMobileWallet = async (
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
    const storedUser = res.locals.user;
    const data = {
        amount,
        charityId,
        caseId,
        caseTitle,
    };
    const payInitResponse = await mobileWalletService.paywithMobileWallet(
        data,
        storedUser
    );
    return {
        data: payInitResponse.data,
    };
};

export { paywithMobileWallet };
