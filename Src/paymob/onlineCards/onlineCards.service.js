import { NotFoundError } from '../../errors/not-found.js';

class PaymobStrategyOnlineCard {
  constructor() {
    this.frameId = process.env.PAYMOB_FRAME_ID;
  }

  CreateAuthenticationRequestOnlineCard = async () => {
    try {
      const request = await fetch('https://accept.paymob.com/api/auth/tokens', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: process.env.PAYMOB_API_KEY }),
      });
      const response = await request.json();
      return response;
    } catch (error) {
      throw new Error(error);
    }
  };

  OrderRegistrationAPIOnlineCard = async (token, amount) => {
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
              name: 'case',
              amount_cents: amount * 100,
              description: 'poor man',
              quantity: '1',
            },
          ],
        }),
      }
    );
    const response = await request.json();
    return response;
  };

  generatePaymentKeyOnlineCard = async (token, order_id, user, amount) => {
    try {
      const request = await fetch(
        `https://accept.paymob.com/api/acceptance/payment_keys`,
        {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            auth_token: token,
            amount_cents: amount * 100,
            expiration: 3600,
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
            integration_id: +process.env.PAYMOB_CREDIT_CARD_INTEGRATION_ID,
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

  createPayment = async (user, amount) => {
    if (!user) throw new NotFoundError('user not found');
    if (!amount || typeof amount !== 'number' || amount <= 0)
      throw new NotFoundError('Invalid amount');

    const { token } = await this.CreateAuthenticationRequestOnlineCard();
    if (!token) throw new NotFoundError('token not found');
    const { id } = await this.OrderRegistrationAPIOnlineCard(token, amount);
    if (!id) throw new NotFoundError('order not found');
    const orderId = id;
    const response = await this.generatePaymentKeyOnlineCard(
      token,
      orderId,
      user,
      amount
    );
    return {
      orderId: orderId,
      tokenThirdStep: response.token,
    };
  };
}
export default PaymobStrategyOnlineCard;