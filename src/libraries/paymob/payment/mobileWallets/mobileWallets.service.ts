import { createPayment } from '../payment.service';
import * as configurationProvider from '../../../configuration-provider/index';
import { IPaymentInfoData } from '../payment.interface';
import { User } from '../../../../components/user/data-access/models/user.model';
const paywithMobileWallet = async (reqBody:IPaymentInfoData, user:User) => {
  const { amount, charityId, caseId, caseTitle } = reqBody;
  const { tokenThirdStep } = await createPayment(
    user,
    +amount,
    charityId,
    caseId,
    caseTitle,
    configurationProvider.getValue('paymob.mobileWalletIntegrationId')
  );
  const request = await fetch(
    ` https://accept.paymob.com/api/acceptance/payments/pay`,
    {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payment_token: tokenThirdStep,
        source: {
          identifier: configurationProvider.getValue(
            'paymob.mobileWalletNumber'
          ), //the wallet number of the user
          subtype: 'WALLET',
        },
      }),
    }
  );
  const response = await request.json();
  return { data: response };
};
export const mobileWalletService = { paywithMobileWallet };
