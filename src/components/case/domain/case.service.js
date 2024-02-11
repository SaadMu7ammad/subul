import { caseUtils } from './case.utils.js';

const addCase = async (caseData, image, charity) => {
    const newCase = await caseUtils.createCase({...caseData,imageCover:image});
    charity.cases.push(newCase._id);
    await charity.save();
    return { case: newCase };
};

const getAllCases = async()=>{
    const sortObj = caseUtils.getSortObj();
    
    const filteringObj = caseUtils.getFilterObj();

    const {page,pageLimit} = caseUtils.getCasesPagination();

    const charityCases = caseUtils.getAllCases();

    return {charityCases}
}

export const caseService = {
    addCase,
    getAllCases
};
