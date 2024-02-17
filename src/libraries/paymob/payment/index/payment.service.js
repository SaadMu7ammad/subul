import * as configurationProvider from '../../../configuration-provider/index.js';
import { NotFoundError } from '../../../errors/components/index.js';
import { paymentUtils } from './payment.utils.js';
const CreateAuthenticationRequest = async () => {
  try {
    const request = await fetch('https://accept.paymob.com/api/auth/tokens', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: configurationProvider.getValue('paymob.apiKey'),
      }),
    });
    const response = await request.json();
    return response;
  } catch (error) {
    throw new Error(error);
  }
};

const OrderRegistrationAPI = async (
  token,
  amount,
  charityId,
  caseId,
  caseTitle
) => {
  const request = await fetch(
    `https://accept.paymobsolutions.com/api/ecommerce/orders`,
    {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_token: token,
        delivery_needed: false,
        amount_cents: amount * 100, //.toString(),
        currency: 'EGP',
        // merchant_order_id: Math.floor(Math.random() * 10),
        items: [
          {
            name: caseId.toString(),
            amount_cents: amount * 100,
            description: `${charityId}-${caseTitle}`,
            quantity: '1',
          },
        ],
      }),
    }
  );
  const response = await request.json();
  return response;
};

const generatePaymentKey = async (
  token,
  order_id,
  user,
  amount,
  integration_id
) => {
  try {
    let request = await fetch(
      `https://accept.paymob.com/api/acceptance/payment_keys`,
      {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auth_token: token,
          amount_cents: amount * 100,
          expiration: 1800, //30 min
          order_id,
          billing_data: {
            email: user.email || 'NA',
            phone_number: user.phone,
            apartment: user.address ? user.address.apartment : 'NA',
            floor: user.address ? user.address.floor : 'NA',
            building: user.address ? user.address.building : 'NA',
            street: user.address ? user.address.street : 'NA',
            city: user.address ? user.address.city : 'NA',
            country: 'Egypt', //"user.address ? user.address.country ": 'NA',
            first_name: user.name.firstName,
            last_name: user.name.lastName,
            state: user.location ? user.location.governorate : 'NA',
            zip_code: user.address ? user.address.zip_code : 'NA',
          },
          currency: 'EGP',
          integration_id: +integration_id,
          lock_order_when_paid: 'false',
        }),
      }
    );
    const response = await request.json();
    return response;
  } catch (error) {
    throw new Error(error);
  }
};
const createPayment = async (
  user,
  amount,
  charityId,
  caseId,
  caseTitle,
  integration_id
) => {
  paymentUtils.checkBeforeCreateLinkForPayment(
    user,
    amount,
    charityId,
    caseId,
    caseTitle
  );
  const { token } = await CreateAuthenticationRequest();
  if (!token) throw new NotFoundError('token not found');
  const { id } = await OrderRegistrationAPI(
    token,
    amount,
    charityId,
    caseId,
    caseTitle
  );
  if (!id) throw new NotFoundError('order not found');
  const orderId = id;
  const response = await generatePaymentKey(
    token,
    orderId,
    user,
    amount,
    integration_id
  );

  return {
    orderId: orderId,
    tokenThirdStep: response.token,
  };
};

export { createPayment };
