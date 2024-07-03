import { CharityDao, ICharity, PlainCharity } from '../data-access/interfaces';
import CharityModel from '../data-access/models/charity.model';

class CharityRepository implements CharityDao {
  async findCharity(email: string): Promise<ICharity | null> {
    const charity: ICharity | null = await CharityModel.findOne({
      email: email,
    });
    return charity;
  }

  async findCharityById(id: string): Promise<ICharity | null> {
    const charity: ICharity | null = await CharityModel.findOne({
      _id: id,
    });
    return charity;
  }

  async createCharity(dataInputs: PlainCharity): Promise<ICharity | null> {
    const charity: ICharity = await CharityModel.create(dataInputs);
    charity.save();
    return charity;
  }
}

export class CHARITY {
  public charityModel = new CharityRepository();

  constructor() {
    // super();
  }
}
