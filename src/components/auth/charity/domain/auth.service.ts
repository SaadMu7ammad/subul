import generateToken from '../../../../utils/generateToken';
import {
  generateResetTokenTemp,
  setupMailSender,
} from '../../../../utils/mailer';
import { authCharityUtils } from './auth.utils';
import { CharityData } from './auth.use-case';
import { Response } from 'express';
import { AuthCharityObject, CharityObject } from '../data-access/interfaces';

const authCharity = async (
  reqBody: { email: string; password: string },
  res: Response<any, Record<string, any>>
): Promise<AuthCharityObject> => {
  const { email, password }: { email: string; password: string } = reqBody;

  const charityResponse = await authCharityUtils.checkCharityPassword(
    email,
    password
  );
  const token = generateToken(
    res,
    charityResponse.charity._id.toString(),
    'charity'
  );
  const charityObj = {
    _id: charityResponse.charity._id,
    name: charityResponse.charity.name,
    email: charityResponse.charity.email,
    isEnabled: charityResponse.charity.email,
    isConfirmed: charityResponse.charity.isConfirmed,
    isPending: charityResponse.charity.isPending,
  };
  const isCharityVerified = authCharityUtils.checkCharityIsVerified(
    charityResponse.charity
  );
  if (isCharityVerified) {
    //if verified no need to send token via email
    return {
      charity: charityObj,
      emailAlert: false,
      token: token,
    };
  } else {
    //not verified(not activated)
    const token = await generateResetTokenTemp();
    await authCharityUtils.setTokenToCharity(charityResponse.charity, token);
    await setupMailSender(
      charityResponse.charity.email,
      'login alert',
      `hi ${charityResponse.charity.name} it seems that your account still not verified or activated please go to that link to activate the account ` +
      `<h3>(www.activate.com)</h3>` +
      `<h3>use that token to confirm the new password</h3> <h2>${token}</h2>`
    );
    return {
      charity: charityObj,
      emailAlert: true,
      token: token,
    };
  }
};

const registerCharity = async (
  reqBody: CharityData
): Promise<{ charity: CharityObject }> => {
  const newCreatedCharity = await authCharityUtils.createCharity(reqBody);
  // generateToken(res, newCreatedCharity.charity._id, 'charity');
  await setupMailSender(
    newCreatedCharity.charity.email,
    'welcome alert',
    `hi ${newCreatedCharity.charity.name} ` +
    ' we are happy that you joined our community ... keep spreading goodness with us'
  );
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
