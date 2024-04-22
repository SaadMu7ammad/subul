import { NextFunction, Request, Response } from 'express';
import { UnauthenticatedError } from '../../libraries/errors/components/index';
// import { AuthedRequest } from '../auth/user/data-access/auth.interface';

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  // const req = _req as AuthedRequest;

  if (!res.locals.charity) {
    //no isAdmin attribure in req.charity to prevent error of undefined isAdmin
    if (res.locals.user.isAdmin && res.locals.user) {
      next(); //notice if i remove else from code the exec will go to the throw err
    } else {
      throw new UnauthenticatedError('you are not an admin');
    }
  } else {
    //if a charity user want to access that route
    throw new UnauthenticatedError('you are not an admin');
  }
};
export { isAdmin };
