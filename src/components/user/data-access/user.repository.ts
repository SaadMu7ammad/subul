import User from './models/user.model.js';

const findUser = async (email) => {
  const user = await User.findOne({ email: email });
  return user;
};
const findUserById = async (id) => {
  const user = await User.findById(id);
  return user;
};
const createUser = async (dataInputs) => {
  const user = await User.create(dataInputs);
  return user;
};
export const userRepository = {
  findUser,
  createUser,
  findUserById,
};
