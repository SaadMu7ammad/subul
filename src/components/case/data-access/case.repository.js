import Case from "./models/case.model.js";

const createCase = async(caseData)=>{
    const newCase = new Case(caseData);
    await newCase.save();
    return newCase;
}

export const caseRepository ={
    createCase
}