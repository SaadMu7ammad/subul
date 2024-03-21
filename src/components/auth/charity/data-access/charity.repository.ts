import { ICharity } from '../../../charity/data-access/interfaces';
import Charity from '../../../charity/data-access/models/charity.model';

const findCharity = async (email: string): Promise<ICharity | null> => {
  const charity = (await Charity.findOne({
    email: email,
  })) as ICharity | null;
  return charity;
};
const createCharity = async (
  dataInputs: any
): Promise<ICharity | null> => {
  const charity = (await Charity.create(dataInputs)) as ICharity | null;
  return charity;
};
export const authCharityRepository = {
  findCharity,
  createCharity,
};
