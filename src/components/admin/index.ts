import { UnauthenticatedError } from '@libs/errors/components/index';
import { NextFunction, Request, Response } from 'express';

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  // console.log(req.t('errors.notAdmin', { lng: 'en' }));
  if (!res.locals.charity) {
    //no isAdmin attribure in req.charity to prevent error of undefined isAdmin
    if (res.locals.user.isAdmin && res.locals.user) {
      next(); //notice if i remove else from code the exec will go to the throw err
    } else {
      throw new UnauthenticatedError(req.t('errors.notAdmin'));
    }
  } else {
    //if a charity user want to access that route
    throw new UnauthenticatedError(req.t('errors.notAdmin'));
  }
};
export { isAdmin };
