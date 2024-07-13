import { AuthCharityObject, CharityData } from '@components/auth/charity/data-access/interfaces';
import {
  AuthCharityResponse, // registerCharityResponse,
} from '@components/auth/charity/data-access/interfaces';
import { NextFunction, Request, Response } from 'express';

import { authCharityUseCaseSkeleton } from '../data-access/interfaces/auth.interfaces';
import { authCharityServiceClass } from './auth.service';

//@desc   submit login page
//@route  POST /api/users/auth
//@access public

export class authCharityUseCase implements authCharityUseCaseSkeleton {
  authCharityServiceInstance: authCharityServiceClass;

  constructor() {
    this.authCharityServiceInstance = new authCharityServiceClass();
    this.registerCharity = this.registerCharity.bind(this);
    this.authCharity = this.authCharity.bind(this);
  }

  async registerCharity(req: Request, res: Response, _next: NextFunction) {
    const {
      email,
      password,
      name,
      phone,
      contactInfo,
      description,
      currency,
      charityLocation,
      charityInfo,
      image: [firstImage],
    }: CharityData = req.body;

    const platform = req.body.platform;

    const data: CharityData = {
      email,
      password,
      name,
      phone,
      contactInfo,
      description,
      currency,
      charityLocation,
      charityInfo,
      image: firstImage !== undefined ? firstImage : '', // [0]
    };

    const responseData = await this.authCharityServiceInstance.registerCharity(res, data, platform);

    // const charityResponsed = {
    //   ...responseData.charity,
    // };

    return responseData;
    // image: charity.image, //notice the image url return as a imgUrl on the fly not in the db itself
  }

  async authCharity(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<AuthCharityResponse> {
    // Better to use different type for data here, not partial<CharityData>
    const { email, password }: { email: string; password: string } = req.body;
    const data = {
      email,
      password,
    };

    const platform = req.body.platform;

    const responseData: AuthCharityObject = await this.authCharityServiceInstance.authCharity(
      data,
      res,
      platform
    );

    const charityResponsed = responseData.charity;

    //first stage check if it verified or not
    if (responseData.emailAlert) {
      //token sent to ur email
      return {
        charity: charityResponsed,
        message: 'Your Account is not Activated Yet,A Token Was Sent To Your Email.',
        token: responseData.token,
        emailAlert: true,
      };
    }
    const returnedObj: AuthCharityResponse = {
      charity: charityResponsed,
      message: '',
      token: responseData.token,
      emailAlert: false,
    };
    //second stage
    //isPending = true and isConfirmed= false
    if (!charityResponsed.isConfirmed && charityResponsed.isPending) {
      returnedObj.message = 'charity docs will be reviewed';
    } //isPending = false and isConfirmed= false
    else if (!charityResponsed.isConfirmed && !charityResponsed.isPending) {
      returnedObj.message = 'you must upload docs to auth the charity';
      //isPending = false and isConfirmed= true
    } else if (charityResponsed.isConfirmed && !charityResponsed.isPending) {
      returnedObj.message = 'you are ready';
    }
    return returnedObj;
  }
}
