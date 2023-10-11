import { UnauthenticatedError } from '../errors/unauthenticated.js';

const isAdmin = (req, res, next) => {
  console.log(req.user);
  if (!req.charity) {
    //no isAdmin attribure in req.charity to prevent error of undefined isAdmin
    if (req.user.isAdmin && req.user) {
      next(); //notice if i remove else from code the exec will go to the throw err
    } else {
      throw new UnauthenticatedError('you are not an admin');
    }
  } else {//if a charity user want to access that route
    throw new UnauthenticatedError('you are not an admin');
  }
};
export { isAdmin };
