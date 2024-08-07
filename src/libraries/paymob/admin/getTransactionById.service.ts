import * as configurationProvider from '@libs/configuration-provider/index';
import { NotFoundError } from '@libs/errors/components/index';

const getTokenStepOne = async () => {
  const request = await fetch('https://accept.paymob.com/api/auth/tokens', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: configurationProvider.getValue('paymob.apiKey'),
    }),
  });
  const response = await request.json();
  if (!response) throw new NotFoundError('no token retrieved');
  console.log('get token first to refund');
  return response.token;
};
const getTransactionInfo = async (authToken: string, transaction_id: string) => {
  const request = await fetch(
    `https://accept.paymob.com/api/acceptance/transactions/${transaction_id}`,
    {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
  const response = await request.json();
  if (!response) throw new NotFoundError('no token retrieved');
  console.log('get transaction second to refund');
  return response;
};

export const getTransactionByIdService = {
  getTokenStepOne,
  getTransactionInfo,
};
