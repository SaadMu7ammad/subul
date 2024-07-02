import * as configurationProvider from '@libs/configuration-provider';
import { NextFunction, Request, Response } from 'express';

import { IPaymentInfoData } from '../payment.interface';
import { createPayment } from '../payment.service';

const payWithMobileWallet = async (req: Request, res: Response, next: NextFunction) => {
  const { amount, charityId, caseId, caseTitle }: IPaymentInfoData = req.body;
  const storedUser = res.locals.user;
  const linkToPay = await createPayment(
    storedUser,
    +amount,
    charityId,
    caseId,
    caseTitle,
    configurationProvider.getValue('paymob.mobileWalletIntegrationId')
  );

  console.log(linkToPay);
  return {
    url: `https://accept.paymob.com/unifiedcheckout/?publicKey=${configurationProvider.getValue('paymob.publicKey')}&clientSecret=${linkToPay.response.client_secret}`,
    response:
      configurationProvider.getValue('environment.nodeEnv') === 'development'
        ? linkToPay.response
        : null,
  };
};

export { payWithMobileWallet };
