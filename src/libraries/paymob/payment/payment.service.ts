import { IUser } from '@components/user/data-access/interfaces';
import * as configurationProvider from '@libs/configuration-provider/index';
import { CustomAPIError, NotFoundError } from '@libs/errors/components/index';

import { paymentUtils } from './payment.utils';

const intentionPayment = async (
  user: IUser,
  amount: number,
  charityId: string,
  caseId: string,
  caseTitle: string,
  integration_id: string
) => {
  try {
    const request = await fetch(`https://accept.paymob.com/v1/intention/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: configurationProvider.getValue('paymob.secretKey'),
      },
      body: JSON.stringify({
        amount: amount * 100,
        payment_methods: [integration_id],
        items: [
          {
            name: caseId.toString(),
            amount: amount * 100,
            description: `${charityId}-${caseTitle}`,
            quantity: '1',
          },
        ],
        currency: 'EGP',
        billing_data: {
          apartment: 'NA', //user.address?.apartment ? user.address.apartment : 'NA',
          first_name: user.name?.firstName,
          last_name: user.name?.lastName,
          street: user.userLocation ? user.userLocation.street : 'NA',
          building: 'NA', // user.address ? user.address.building : 'NA',
          phone_number: user.phone,
          country: 'Egypt', //"user.address ? user.address.country ": 'NA',
          email: user.email || 'NA',
          floor: 'NA', //user.address ? user.address.floor : 'NA',
          state: user.userLocation ? user.userLocation.governorate : 'NA',
        },
      }),
    });
    const response = await request.json();
    return response;
  } catch (error: unknown) {
    if (error instanceof CustomAPIError || error instanceof Error) {
      throw new NotFoundError(error.message);
    } else {
      throw new NotFoundError('strange behaviour');
    }
  }
};
const createPayment = async (
  user: IUser,
  amount: number,
  charityId: string,
  caseId: string,
  caseTitle: string,
  integration_id: string
) => {
  paymentUtils.checkBeforeCreateLinkForPayment(user, amount, charityId, caseId, caseTitle);

  const response = await intentionPayment(
    user,
    amount,
    charityId,
    caseId,
    caseTitle,
    integration_id
  );

  return {
    response,
  };
};

export { createPayment };
