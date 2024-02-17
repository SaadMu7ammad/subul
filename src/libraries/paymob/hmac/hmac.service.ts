import { createHmac } from 'crypto';

const calculateHMAC = (data, secretKey) => {
  const sortedKeys = Object.keys(data).sort(); // Sort keys lexicographically
  const concatenatedString = sortedKeys.map((key) => data[key]).join(''); // Concatenate values
  const hmac = createHmac('sha512', secretKey);
  hmac.update(concatenatedString);
  return hmac.digest('hex');
};

export const hmacService = { calculateHMAC };
