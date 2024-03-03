import CharityModel from './models/charity.model';
import { CharityDao } from './interfaces/charity.dao';
import { ICharityDocument } from './interfaces/charity.interface';
export class CharityRepository implements CharityDao {
  async findCharity(email: string): Promise<ICharityDocument | null> {
    const charity = (await CharityModel.findOne({
      email: email,
    })) as ICharityDocument | null;
    return charity;
  }

  async findCharityById(id: string): Promise<ICharityDocument | null> {
    const charity = (await CharityModel.findOne({
      id: id,
    })) as ICharityDocument | null;
    return charity;
  }

  async createCharity(
    dataInputs: ICharityDocument
  ): Promise<ICharityDocument | null> {
    const charity = (await CharityModel.create(
      dataInputs
    )) as ICharityDocument | null;
    return charity;
  }
}
