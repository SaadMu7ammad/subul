import Charity from './models/charity.model.js';

const findCharity = async (email:string) => {
  const charity = await Charity.findOne({ email: email });
  return charity;
};

const findCharityById = async (id:string) => {
    const charity = await Charity.findOne({ id: id });
    return charity;
  };
const createCharity = async (dataInputs) => {
  const charity = await Charity.create(dataInputs);
  return charity;
};
export const charityRepository = {
  findCharity,
  createCharity,findCharityById
};
