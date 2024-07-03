import { ICharity } from '@components/charity/data-access/interfaces';
import Charity from '@components/charity/data-access/models/charity.model';

import { CharityData } from './interfaces';

const findCharity = async (email: string): Promise<ICharity | null> => {
  const charity = await Charity.findOne({
    email: email,
  });
  return charity;
};

const createCharity = async (dataInputs: CharityData): Promise<ICharity | null> => {
  const charity = (await Charity.create(dataInputs)) as ICharity | null;
  return charity;
};

export const authCharityRepository = {
  findCharity,
  createCharity,
};
