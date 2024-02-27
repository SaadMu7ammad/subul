import { caseUtils } from './case.utils.js';
import {Case, CaseDocument} from '../data-access/interfaces/case.interface.js';
const addCase = async (caseData:Case, image:string, charity) => {
    const newCase:CaseDocument = await caseUtils.createCase({
        ...caseData,
        coverImage: image,
        charity: charity._id,
    });
    charity.cases.push(newCase._id);
    await charity.save();
    return { case: newCase };
};

const getAllCases = async (charityId:string, queryParams) => {
    const sortObj = caseUtils.getSortObj(queryParams.sort);

    const filterObj = caseUtils.getFilterObj(charityId, queryParams);

    const { page, pageLimit }:{page:number, pageLimit:number} = caseUtils.getCasesPagination(queryParams);

    const cases = await caseUtils.getAllCases(
        sortObj,
        filterObj,
        page,
        pageLimit
    );

    return { cases };
};

const getCaseById = async (charityCases, caseId:string) => {
    caseUtils.checkIfCaseBelongsToCharity(charityCases, caseId);

    const _case = await caseUtils.getCaseByIdFromDB(caseId);

    return {
        case: _case,
    };
};

const deleteCase = async (charity, caseId:string) => {
    const idx:number = caseUtils.checkIfCaseBelongsToCharity(charity.cases, caseId);

    const deletedCase = await caseUtils.deleteCaseFromDB(caseId);

    await caseUtils.deleteCaseFromCharityCasesArray(charity, idx);

    return {
        deletedCase,
    };
};

const editCase = async (charity, caseData, caseId:string) => {
    caseUtils.checkIfCaseBelongsToCharity(charity.cases, caseId);

    let deleteOldImg:(()=>void )| null = null;
    if (caseData.image) {
        deleteOldImg = await caseUtils.replaceCaseImg(caseData, caseId);
    }

    let updatedCase = await caseUtils.editCase(caseData, caseId);

    if(deleteOldImg)deleteOldImg();

    return {
        case: updatedCase,
    };
};

export const caseService = {
    addCase,
    getAllCases,
    getCaseById,
    deleteCase,
    editCase,
};
