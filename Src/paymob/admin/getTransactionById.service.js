const getTokenStepOne = async () => {
  try {
    const request = await fetch('https://accept.paymob.com/api/auth/tokens', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: process.env.PAYMOB_API_KEY }),
    });
    const response = await request.json();
    return response.token;
  } catch (error) {
    throw new Error(error);
  }
};
const getTransactionInfo = async (authToken, transaction_id) => {
  try {
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
    return response;
  } catch (error) {
    throw new Error(error);
  }
};

export const getTransactionByIdService = {
  getTokenStepOne,
  getTransactionInfo,
};