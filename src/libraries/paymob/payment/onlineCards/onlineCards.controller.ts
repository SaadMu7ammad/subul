import { IUser } from '@components/user/data-access/interfaces';
import * as configurationProvider from '@libs/configuration-provider/index';
import { IPaymentInfoData } from '@libs/paymob/payment/payment.interface';
import { NextFunction, Request, Response } from 'express';

import { createPayment } from '../payment.service';

const payWithOnlineCard = async (req: Request, res: Response, next: NextFunction) => {
  const { amount, charityId, caseId, caseTitle }: IPaymentInfoData = req.body;
  const storedUser: IUser = res.locals.user;
  const linkToPay = await createPayment(
    storedUser,
    +amount,
    charityId,
    caseId,
    caseTitle,
    configurationProvider.getValue('paymob.creditCardIntegrationId')
  );

  storedUser.totalDonationsAmount += amount;

  console.log(linkToPay);
  return {
    url: `https://accept.paymob.com/unifiedcheckout/?publicKey=${configurationProvider.getValue('paymob.publicKey')}&clientSecret=${linkToPay.response.client_secret}`,
    response:
      configurationProvider.getValue('environment.nodeEnv') === 'development'
        ? linkToPay.response
        : null,
  };
};

export { payWithOnlineCard };
