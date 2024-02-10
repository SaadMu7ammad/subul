import caseRepository from '../data-access/case.repository.js';

const addCase = async (caseData, image, charity) => {
    const newCase = caseRepository.createCase(caseData);
    charity.cases.push(newCase._id);
    await charity.save();
    return { case: newCase };
};

export const caseService = {
    addCase,
};
