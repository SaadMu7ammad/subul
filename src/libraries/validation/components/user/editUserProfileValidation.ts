import { registerUserValidation } from './userAuthValidation';

const editUserProfileValidation = registerUserValidation.map(validator => validator.optional());
export { editUserProfileValidation };
