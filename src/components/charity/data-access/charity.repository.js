import Charity from '../data-access/models/charity.model.js';

const findCharity = async (email) => {
  const charity = await Charity.findOne({ email: email });
  return charity;
};

const findCharityById = async (Id) => {
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
