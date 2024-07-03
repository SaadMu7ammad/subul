import {
  AuthCharityObject,
  CharityData,
  CharityObject,
} from '@components/auth/charity/data-access/interfaces';
import generateToken from '@utils/generateToken';
import { generateResetTokenTemp, sendActivationEmail, setupMailSender } from '@utils/mailer';
import { Response } from 'express';

import logger from '../../../../utils/logger';
import { authCharityServiceSkeleton } from '../data-access/interfaces/auth.interfaces';
import { authCharityUtilsClass } from './auth.utils';

export class authCharityServiceClass implements authCharityServiceSkeleton {
  authCharityUtilsInstance: authCharityUtilsClass;

  constructor() {
    this.authCharity = this.authCharity.bind(this);
    this.registerCharity = this.registerCharity.bind(this);
    this.authCharityUtilsInstance = new authCharityUtilsClass();
  }
  async authCharity(
    reqBody: { email: string; password: string },
    res: Response
  ): Promise<AuthCharityObject> {
    const { email, password }: { email: string; password: string } = reqBody;

    const charityResponse = await this.authCharityUtilsInstance.checkCharityPassword(
      email,
      password
    );
    const token = generateToken(res, charityResponse.charity._id.toString(), 'charity');

    const isCharityVerified = this.authCharityUtilsInstance.checkCharityIsVerified(
      charityResponse.charity
    );
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
      await this.authCharityUtilsInstance.setTokenToCharity(charityResponse.charity, token);
      await sendActivationEmail(charityResponse.charity.email, token);
      return {
        charity: charityResponse.charity,
        emailAlert: true,
        token: token,
      };
    }
  }

  async registerCharity(reqBody: CharityData): Promise<{ charity: CharityObject }> {
    const newCreatedCharity = await this.authCharityUtilsInstance.createCharity(reqBody);
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
  }
}
// export const authCharityService = {
//   authCharity,
//   registerCharity,
// };
