import { UnauthenticatedError } from '../errors/unauthenticated.js';

const isConfirmed = (req, res, next) => {
    if (!req.user) {
        if (req.charity && req.charity.isConfirmed) {
            next();
        } else {
            throw new UnauthenticatedError(
                'Charity Account is not Confirmed , You must upload your docs first!'
            );
        }
    } else {
        //if a user wants to access that route
        throw new UnauthenticatedError(
            'Users Are Not Allowed To Preform This Action!'
        );
    }
};
export { isConfirmed };
