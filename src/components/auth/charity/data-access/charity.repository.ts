import { ICharityDocument } from '../../../charity/data-access/interfaces/charity.interface';
import Charity from '../../../charity/data-access/models/charity.model';

const findCharity = async (email: string): Promise<ICharityDocument | null> => {
  const charity = (await Charity.findOne({
    email: email,
  })) as ICharityDocument | null;
  return charity;
};
const createCharity = async (
  dataInputs: any
): Promise<ICharityDocument | null> => {
  const charity = (await Charity.create(dataInputs)) as ICharityDocument | null;
  return charity;
};
export const authCharityRepository = {
  findCharity,
  createCharity,
};
