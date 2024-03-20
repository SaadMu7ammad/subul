import CharityModel, { ICharity } from './models/charity.model';
import { CharityDao } from './interfaces/';
import { HydratedDocument } from 'mongoose';

export class CharityRepository implements CharityDao {
  async findCharity(email: string): Promise<ICharity | null> {
    const charity: HydratedDocument<ICharity> | null =
      await CharityModel.findOne({
        email: email,
      });
    return charity;
  }

  async findCharityById(id: string): Promise<ICharity | null> {
    const charity: HydratedDocument<ICharity> | null =
      await CharityModel.findOne({
        id: id,
      });
    return charity;
  }

  async createCharity(dataInputs: ICharity): Promise<ICharity | null> {
    const charity: HydratedDocument<ICharity> = await CharityModel.create(
      dataInputs
    );
    charity.save();
    return charity;
  }
}
