import {caseRepository} from '../data-access/case.repository.js';

const createCase = async(caseData)=>{
    return await caseRepository.createCase(caseData);
}

export const caseUtils={
    createCase
}