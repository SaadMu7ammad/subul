import { caseUtils } from './case.utils.js';

const addCase = async (caseData, image, charity) => {
    const newCase = await caseUtils.createCase({
        ...caseData,
        imageCover: image,
        charity: charity._id,
    });
    charity.cases.push(newCase._id);
    await charity.save();
    return { case: newCase };
};

const getAllCases = async (charityId, queryParams) => {
    const sortObj = caseUtils.getSortObj(queryParams.sort);

    const filterObj = caseUtils.getFilterObj(charityId, queryParams);

    const { page, pageLimit } = caseUtils.getCasesPagination(queryParams);

    const cases = await caseUtils.getAllCases(
        sortObj,
        filterObj,
        page,
        pageLimit
    );

    return { cases };
};

const getCaseById = async (charityCases, caseId) => {
    caseUtils.checkIfCaseBelongsToCharity(
        charityCases,
        caseId
    );

    const _case = await caseUtils.getCaseByIdFromDB(caseId);

    return {
        case: _case,
    };
};

const deleteCase = async (charity,caseId)=>{
    const idx = caseUtils.checkIfCaseBelongsToCharity(charity.cases,caseId);

    const deletedCase = await caseUtils.deleteCaseFromDB(caseId);

    await caseUtils.deleteCaseFromCharityCasesArray(charity,idx);

    return {
        deletedCase
    }
}

export const caseService = {
    addCase,
    getAllCases,
    getCaseById,
    deleteCase
};
