import Case from './models/case.model.js';

const createCase = async (caseData) => {
    const newCase = new Case(caseData);
    await newCase.save();
    return newCase;
};

const getAllCases = async () => {
    const charityCases = await Case.aggregate([
        {
            $match: filterObject,
        },
        {
            $sort: sortObject,
        },
    ])
        .skip((page - 1) * pageLimit)
        .limit(pageLimit)
        .project(
            '-gender -upVotes -views -dateFinished -donationNumbers -helpedNumbers -freezed -createdAt -updatedAt -__v'
        );
        
    return charityCases;
};

export const caseRepository = {
    createCase,
};
