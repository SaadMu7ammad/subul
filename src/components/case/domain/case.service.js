import { caseUtils } from './case.utils.js';

const addCase = async (caseData, image, charity) => {
    const newCase = await caseUtils.createCase({
        ...caseData,
        imageCover: image,
        charity:charity._id
    });
    charity.cases.push(newCase._id);
    await charity.save();
    return { case: newCase };
};

const getAllCases = async (charityId,queryParams) => {
    const sortObj = caseUtils.getSortObj(queryParams.sort);

    const filterObj = caseUtils.getFilterObj(charityId,queryParams);

    const { page, pageLimit } = caseUtils.getCasesPagination(queryParams);

    const cases = await caseUtils.getAllCases(sortObj,filterObj,page,pageLimit);

    return { cases };
};

export const caseService = {
    addCase,
    getAllCases,
};
