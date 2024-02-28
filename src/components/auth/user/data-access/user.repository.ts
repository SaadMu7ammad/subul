import User from '../../../user/data-access/models/user.model.js';

const findUser = async (email:string) => {
  const user = await User.findOne({ email: email });
  return user;
};
const createUser = async (dataInputs) => {
  const user = await User.create(dataInputs);
  return user;
};
export const authUserRepository = {
  findUser,
  createUser,
};
