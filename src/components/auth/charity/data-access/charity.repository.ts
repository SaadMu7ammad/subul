import { ICharityDocument } from '../../../charity/data-access/interfaces/charity.interface';
import Charity from '../../../charity/data-access/models/charity.model';
import { CharityData } from '../domain/auth.use-case';

// If you're using Mongoose, you may want to extend the interface with the Document type provided by Mongoose

// const findCharity = async (email: string): Promise<ICharityDocument | null> => {
//   const charity = (await Charity.findOne({
//     email: email,
//   })) as ICharityDocument | null;
//   return charity;
// };
const findCharity = async (email: string): Promise<ICharityDocument | null> => {
  const charity: ICharityDocument | null = await Charity.findOne({
    email: email,
  });
  return charity;
};

const createCharity = async (
  dataInputs: CharityData
): Promise<ICharityDocument> => {
  // @ts-expect-error
  const charity: ICharityDocument = await Charity.create(dataInputs); // must be `as` cuz of incompatibility issues with ICharityDocument & Charity.create.
  return charity;
};

export const authCharityRepository = {
  findCharity,
  createCharity,
};
