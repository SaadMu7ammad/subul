import { IUser } from '../../../components/user/data-access/interfaces/user.interface.js';
import * as configurationProvider from '../../configuration-provider/index.js';
import { NotFoundError } from '../../errors/components/index.js';
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
  } catch (error:any) {
    throw new Error(error);
  }
};

const OrderRegistrationAPI = async (
  token:string,
  amount:number,
  charityId:string,
  caseId:string,
  caseTitle:string
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
  token:string,
  order_id:string,
  user:IUser,
  amount:number,
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
            apartment: 'NA',//user.address?.apartment ? user.address.apartment : 'NA',
            floor: 'NA',//user.address ? user.address.floor : 'NA',
            building:'NA',// user.address ? user.address.building : 'NA',
            street: user.locationUser ? user.locationUser.street : 'NA',
            city: user.locationUser ? user.locationUser.city : 'NA',
            country: 'Egypt', //"user.address ? user.address.country ": 'NA',
            first_name: user.name.firstName,
            last_name: user.name.lastName,
            state: user.locationUser ? user.locationUser.governorate : 'NA',
            zip_code:'NA',// user.locationUser ? user.locationUser.zip_code : 'NA',
          },
          currency: 'EGP',
          integration_id: +integration_id,
          lock_order_when_paid: 'false',
        }),
      }
    );
    const response = await request.json();
    return response;
  } catch (error:any) {
    throw new Error(error);
  }
};
const createPayment = async (
  user:IUser,
  amount:number,
  charityId:string,
  caseId:string,
  caseTitle:string,
  integration_id
) => {
  paymentUtils.checkBeforeCreateLinkForPayment(
    user,
    amount,
    charityId,
    caseId,
    caseTitle
  );
  const { token }:{token:string} = await CreateAuthenticationRequest();
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
