import Charity from '../../../charity/data-access/models/charity.model.js';

const findCharity = async (email:string) => {
  const charity = await Charity.findOne({ email: email });
  return charity;
};
const createCharity = async (dataInputs) => {
  const charity = await Charity.create(dataInputs);
  return charity;
};
export const authCharityRepository = {
  findCharity,
  createCharity,
};
