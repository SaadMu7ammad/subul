import { createHmac } from 'crypto';

import { Idata } from './hmac.interface';

const calculateHMAC = (data: Idata, secretKey: string) => {
  const sortedKeys = Object.keys(data).sort(); // Sort keys lexicographically
  const concatenatedString: string = sortedKeys.map(key => data[key as keyof Idata]).join(''); // Concatenate values
  const hmac = createHmac('sha512', secretKey);
  hmac.update(concatenatedString);
  return hmac.digest('hex');
};

export const hmacService = { calculateHMAC };
