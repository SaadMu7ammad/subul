import { AuthCharityObject, CharityObject } from '@components/auth/charity/data-access/interfaces';
import generateToken from '@utils/generateToken';
import { generateResetTokenTemp, sendReactivationEmail, setupMailSender } from '@utils/mailer';
import { Response } from 'express';

import logger from '../../../../utils/logger';
import { CharityData } from './auth.use-case';
import { authCharityUtils } from './auth.utils';

const authCharity = async (
  reqBody: { email: string; password: string },
  res: Response<any, Record<string, any>>
): Promise<AuthCharityObject> => {
  const { email, password }: { email: string; password: string } = reqBody;

  const charityResponse = await authCharityUtils.checkCharityPassword(email, password);
  const token = generateToken(res, charityResponse.charity._id.toString(), 'charity');

  const isCharityVerified = authCharityUtils.checkCharityIsVerified(charityResponse.charity);
  if (isCharityVerified) {
    //if verified no need to send token via email
    return {
      charity: charityResponse.charity,
      emailAlert: false,
      token: token,
    };
  } else {
    //not verified(not activated)
    const token = await generateResetTokenTemp();
    await authCharityUtils.setTokenToCharity(charityResponse.charity, token);
    await sendReactivationEmail(charityResponse.charity.email, token);
    return {
      charity: charityResponse.charity,
      emailAlert: true,
      token: token,
    };
  }
};

const registerCharity = async (reqBody: CharityData): Promise<{ charity: CharityObject }> => {
  const newCreatedCharity = await authCharityUtils.createCharity(reqBody);
  // generateToken(res, newCreatedCharity.charity._id, 'charity');
  try {
    await setupMailSender(
      newCreatedCharity.charity.email,
      'Welcome Alert',
      `hi ${newCreatedCharity.charity.name} ` +
        ' we are happy that you joined our community ... keep spreading goodness with us'
    );
  } catch (err) {
    logger.warn('error happened while sending welcome email');
  }
  const charityObj: CharityObject = {
    _id: newCreatedCharity.charity._id,
    name: newCreatedCharity.charity.name,
    email: newCreatedCharity.charity.email,
    image: newCreatedCharity.charity.image, //notice the image url return as a imgUrl on the fly not in the db itself
  };

  return {
    charity: charityObj,
  };
};

export const authCharityService = {
  authCharity,
  registerCharity,
};
