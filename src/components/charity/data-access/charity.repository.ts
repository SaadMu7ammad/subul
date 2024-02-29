import Charity from './models/charity.model.js';
import { CharityDao } from './interfaces/charity.dao.js';
import { ICharityDocument } from './interfaces/charity.interface.js';
export class CharityRepository implements CharityDao {
    findCharity = async (email: string) => {
        const charity = await Charity.findOne({ email: email });
        return charity;
    };

    findCharityById = async (id: string) => {
        const charity = await Charity.findOne({ id: id });
        return charity;
    };

    createCharity = async (dataInputs:ICharityDocument) => {
        const charity = await Charity.create(dataInputs);
        return charity;
    };
};