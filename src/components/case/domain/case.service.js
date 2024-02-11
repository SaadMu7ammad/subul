import { caseUtils } from './case.utils.js';

const addCase = async (caseData, image, charity) => {
    const newCase = await caseUtils.createCase({...caseData,imageCover:image});
    charity.cases.push(newCase._id);
    await charity.save();
    return { case: newCase };
};

export const caseService = {
    addCase,
};
