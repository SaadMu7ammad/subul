import { NextFunction, Response } from 'express';
import { mobileWalletService } from './mobileWallets.service.js';
import { authedRequest } from '../../../../components/auth/user/data-access/auth.interface.js';
const paywithMobileWallet = async (req:authedRequest, res:Response, next:NextFunction) => {
  const { amount, charityId, caseId, caseTitle }:{amount:number, charityId:string, caseId:string, caseTitle:string} = req.body;
  const storedUser = req.user;
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
