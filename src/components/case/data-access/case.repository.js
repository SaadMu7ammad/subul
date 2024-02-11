import Case from './models/case.model.js';

const createCase = async (caseData) => {
    const newCase = new Case(caseData);

    await newCase.save();
    
    return newCase;
};

const getAllCases = async (sortObj,filterObj,page,pageLimit) => {
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
        .project(
            '-gender -upVotes -views -dateFinished -donationNumbers -helpedNumbers -freezed -createdAt -updatedAt -__v'
        );
        
    return charityCases;
};

const getCaseById = async(id)=>{
    const _case = await Case.findById(id);
    return _case;
}

const deleteCaseById = async(id)=>{
    const _case = await Case.findByIdAndDelete(id);
    return _case;
}

export const caseRepository = {
    createCase,
    getAllCases,
    getCaseById,
    deleteCaseById
};
