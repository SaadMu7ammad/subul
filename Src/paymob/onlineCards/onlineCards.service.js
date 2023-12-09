import axios from 'axios';
import dotenv from 'dotenv/config';
import asyncHandler from 'express-async-handler';

let token;
let orderId;
let amount = 2000;
let merch;
let tokenThirdStep;
const CreateAuthenticationRequestOnlineCard = async (req, res, next) => {
  const response = await axios.post(
    'https://accept.paymob.com/api/auth/tokens',
    {
      api_key: process.env.PAYMOB_API_KEY,
    }
  );
  const { data } = response;

  // Extract relevant data from the response
  token = data.token;

  console.log(token);
  console.log(orderId);
  console.log(amount);
  console.log(tokenThirdStep);

  return res.status(201).json({ data: response.data });
};

const OrderRegistrationAPIOnlineCard = async (req, res) => {
  let response = await axios.post(
    `https://accept.paymobsolutions.com/api/ecommerce/orders`,
    {
      auth_token: token,
      delivery_needed: false,
      amount_cents: amount * 100, //.toString(),
      currency: 'EGP',
      // merchant_order_id: Math.floor(Math.random() * 10),
      items: [
        {
          name: 'case',
          amount_cents: '500000',
          description: 'poor man',
          quantity: '1',
        },
      ],
    }
  );
  orderId = response.data.id;
  console.log(token);
  console.log(orderId);
  console.log(amount);
  console.log(tokenThirdStep);

  //   console.log(merchant_order_id);
  return res.status(201).json({ data: response.data });
};
const PaymentKeyRequestOnlineCard = asyncHandler(async (req, res) => {
  try {
    const user = {
      firstName: 'Saul',
      lastName: 'Momo',
      phone: '01021533501',
    };
    let response = await axios.post(
      `https://accept.paymob.com/api/acceptance/payment_keys`,
      {
        auth_token: token,
        amount_cents: amount * 100,
        expiration: 3600,
        orderId,
        billing_data: {
          email: user.email || 'NA',
          phone_number: user.phone,
          apartment: user.address ? user.address.apartment : 'NA',
          floor: user.address ? user.address.floor : 'NA',
          building: user.address ? user.address.building : 'NA',
          street: user.address ? user.address.street : 'NA',
          city: user.address ? user.address.city : 'NA',
          country: user.address ? user.address.country : 'NA',
          first_name: user.firstName,
          last_name: user.lastName,
          state: user.address ? user.address.state : 'NA',
          zip_code: user.address ? user.address.zip_code : 'NA',
        },
        currency: 'EGP',
        integration_id: +process.env.PAYMOB_CREDIT_CARD_INTEGRATION_ID,
        lock_order_when_paid: 'false',
      }
    );
    //   return response.data.token;
    tokenThirdStep = response.data.token;
    console.log(token);
    console.log(orderId);
    console.log(amount);
    // console.log(response);
    console.log(tokenThirdStep);
    console.log('-------------');
    return res.status(201).json({ data: response.data });
    // return tokenThirdStep;
  } catch (error) {
    throw new Error(error);
  }
});

//after three configuration stages done
//we have 2 choices
const payWithOnlineCard = async (req, res, next) =>{
  console.log(tokenThirdStep);
  const CardPayments = `https://accept.paymobsolutions.com/api/acceptance/iframes/${process.env.PAYMOB_FRAME_ID}?payment_token=${tokenThirdStep}`;
  return res.status(201).json({ CardPayments });
};

export {
  CreateAuthenticationRequestOnlineCard,
  OrderRegistrationAPIOnlineCard,
  PaymentKeyRequestOnlineCard,
  payWithOnlineCard,
};
