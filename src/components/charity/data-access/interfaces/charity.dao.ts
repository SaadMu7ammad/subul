import { ICharity } from '../interfaces/';
export interface CharityDao {
    findCharity: (email: string) => Promise<ICharity | null>;
    createCharity: (dataInputs: ICharity) => Promise<ICharity|null>;//shouldn't be Partial<ICharity>?
    findCharityById: (id: string) => Promise<ICharity | null>;
}
