import { ICharity } from '@components/charity/data-access/interfaces';
import { NextFunction, Request, Response } from 'express';

import { AuthCharityResponse, registerCharityResponse } from './auth.api';
import { AuthCharityObject, CharityData, CharityObject } from './auth.charity';

export interface authCharityServiceSkeleton {
  authCharity(
    reqBody: { email: string; password: string },
    res: Response
  ): Promise<AuthCharityObject>;

  registerCharity(reqBody: CharityData): Promise<{ charity: CharityObject }>;
}

export interface authCharityUseCaseSkeleton {
  registerCharity(
    req: Request,
    _res: Response,
    _next: NextFunction
  ): Promise<registerCharityResponse>;

  authCharity(req: Request, res: Response, _next: NextFunction): Promise<AuthCharityResponse>;
}

export interface authCharityUtilsSkeleton {
  checkCharityPassword(
    email: string,
    password: string
  ): Promise<{ isMatch: boolean; charity: ICharity }>;
  setTokenToCharity(charity: ICharity, token: string): Promise<void>;
  createCharity(dataInputs: CharityData): Promise<{ charity: ICharity }>;
  checkCharityIsVerified(charity: ICharity): boolean;
}
