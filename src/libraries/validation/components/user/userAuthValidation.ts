import { emailValidation, genderValidtion, governorateValidation, nameUserValidation, passwordValidation, phoneValidation } from './allUserValidation';
const registerUserValidation = [
  ...nameUserValidation,
  emailValidation,
  phoneValidation,
 genderValidtion,
 governorateValidation,
  passwordValidation
];
const loginUserValidation = [emailValidation, passwordValidation];
export { registerUserValidation, loginUserValidation };
