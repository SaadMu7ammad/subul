import { CharityDocument } from './charity.interface';
export interface CharityDao {
    findCharity: (email: string) => Promise<CharityDocument | null>;
    createCharity: (dataInputs: CharityDocument) => Promise<CharityDocument>;//shouldn't be Partial<CharityDocument>?
    findCharityById: (id: string) => Promise<CharityDocument | null>;
}
