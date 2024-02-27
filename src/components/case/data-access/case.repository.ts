import { CaseDocument, CaseObject } from './interfaces/case.interface.js';
import Case from './models/case.model.js';

const createCase = async (caseData:CaseObject):Promise<CaseDocument> => {
    const newCase = new Case(caseData);

    await newCase.save();

    return newCase;
};

const getAllCases = async (sortObj, filterObj, page:number, pageLimit:number) => {
    const charityCases = await Case.aggregate([
        {
            $match: filterObj,
        },
        {
            $sort: sortObj,
        },
    ])
        .skip((page - 1) * pageLimit)
        .limit(pageLimit)
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
            __v: 0
        });

    return charityCases;
};

const getCaseById = async (id:string) => {
    const _case = await Case.findById(id);
    return _case;
};

const deleteCaseById = async (id:string) => {
    const _case = await Case.findByIdAndDelete(id);
    return _case;
};

const editCase = async (caseData,id:string) => {
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

export const caseRepository = {
    createCase,
    getAllCases,
    getCaseById,
    deleteCaseById,
    editCase
};
