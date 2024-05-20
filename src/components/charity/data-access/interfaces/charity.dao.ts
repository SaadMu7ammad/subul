import { ICharity } from '../interfaces/';

export interface CharityDao {
  findCharity: (email: string) => Promise<ICharity | null>;
  createCharity: (dataInputs: ICharity) => Promise<ICharity | null>;
  findCharityById: (id: string) => Promise<ICharity | null>;
}
