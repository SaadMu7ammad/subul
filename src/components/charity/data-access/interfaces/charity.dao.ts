import { ICharityDocument } from './charity.interface';
export interface CharityDao {
    findCharity: (email: string) => Promise<ICharityDocument | null>;
    createCharity: (dataInputs: ICharityDocument) => Promise<ICharityDocument>;//shouldn't be Partial<ICharityDocument>?
    findCharityById: (id: string) => Promise<ICharityDocument | null>;
}
