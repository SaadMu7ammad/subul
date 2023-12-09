import dotenv from 'dotenv/config';

let token;
let orderId;
let amount = 2000;
let merch;
let tokenThirdStep;
const CreateAuthenticationRequestOnlineCard = async (req, res, next) => {
  const request = await fetch('https://accept.paymob.com/api/auth/tokens', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: process.env.PAYMOB_API_KEY }),
  });
  const response = await request.json();

  // Extract relevant data from the response
  token = response.token;

  console.log(token);
  console.log(orderId);
  console.log(amount);
  console.log(tokenThirdStep);

  return res.status(201).json({ data: response });
};

const OrderRegistrationAPIOnlineCard = async (req, res) => {
  let request = await fetch(
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
            name: 'case',
            amount_cents: '500000',
            description: 'poor man',
            quantity: '1',
          },
        ],
      }),
    }
  );
  const response = await request.json();
  orderId = response.id;
  console.log(token);
  console.log(orderId);
  console.log(amount);
  console.log(tokenThirdStep);

  //   console.log(merchant_order_id);
  return res.status(201).json({ data: response });
};
const PaymentKeyRequestOnlineCard = async (req, res) => {
  try {
    const user = {
      firstName: 'Saul',
      lastName: 'Momo',
      phone: '01021533501',
    };
    let request = await fetch(
      `https://accept.paymob.com/api/acceptance/payment_keys`,
      {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
        }),
      }
    );
    const response = await request.json();

    //   return response.data.token;
    console.log(token);
    tokenThirdStep = response.token;
    console.log(token);
    console.log(orderId);
    console.log(amount);
    console.log(tokenThirdStep);
    return res.status(201).json({ data: response });
    // return tokenThirdStep;
  } catch (error) {
    throw new Error(error);
  }
};

//after three configuration stages done
//we have 2 choices
const payWithOnlineCard = async (req, res, next) => {
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
