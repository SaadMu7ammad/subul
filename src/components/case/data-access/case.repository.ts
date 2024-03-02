import { ICaseDocument, ICase } from './interfaces/case.interface';
import Case from './models/case.model';
import { CaseDao } from './interfaces/case.dao';

export class CaseRepository implements CaseDao {
    createCase = async (caseData:ICase): Promise<ICaseDocument> => {
        const newCase = new Case(caseData);

        await newCase.save();

        return newCase;
    };

    getAllCases = async (sortObj, filterObj, page: number, limit: number) => {
        const charityCases = await Case.aggregate([
            {
                $match: filterObj,
            },
            {
                $sort: sortObj,
            },
        ])
            .skip((page - 1) * limit)
            .limit(limit)
            .project({
                gender: 0,
                upVotes: 0,
                views: 0,
                dateFinished: 0,
                donationNumbers: 0,
                helpedNumbers: 0,
                freezed: 0,
                createdAt: 0,
                updatedAt: 0,
                __v: 0,
            });

        return charityCases;
    };

    getCaseById = async (id: string) => {
        const _case = await Case.findById(id);
        return _case;
    };

    deleteCaseById = async (id: string) => {
        const _case = await Case.findByIdAndDelete(id);
        return _case;
    };

    editCase = async (caseData:ICase, id: string) => {
        const updatedCase = await Case.findByIdAndUpdate(
            id,
            {
                $set: { ...caseData },
            },
            {
                new: true,
                runValidators: true,
            }
        );

        return updatedCase;
    };
}
