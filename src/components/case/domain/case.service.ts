import { caseUtils } from './case.utils.js';
import {
    Case,
    CaseDocument,
    FilterObj,
    GetAllCasesQueryParams,
    PaginationObj,
    SortObj,
} from '../data-access/interfaces/case.interface.js';
const addCase = async (caseData: Case, image: string, charity) => {
    const newCase: CaseDocument = await caseUtils.createCase({
        ...caseData,
        coverImage: image,
        charity: charity._id,
    });

    charity.cases.push(newCase._id);

    await charity.save();

    return { case: newCase };
};

const getAllCases = async (charityId: string, queryParams:GetAllCasesQueryParams) => {
    const sortObj: SortObj = caseUtils.getSortObj(queryParams.sort);

    const filterObj: FilterObj = caseUtils.getFilterObj(charityId, queryParams);

    const { page, limit }: PaginationObj =
        caseUtils.getCasesPagination(queryParams);

    const cases = await caseUtils.getAllCases(sortObj, filterObj, page, limit);

    return { cases };
};

const getCaseById = async (charityCases:CaseDocument[], caseId: string) => {
    caseUtils.checkIfCaseBelongsToCharity(charityCases, caseId);

    const _case: CaseDocument = await caseUtils.getCaseByIdFromDB(caseId);

    return {
        case: _case,
    };
};

const deleteCase = async (charity, caseId: string) => {
    const idx: number = caseUtils.checkIfCaseBelongsToCharity(
        charity.cases,
        caseId
    );

    const deletedCase: CaseDocument = await caseUtils.deleteCaseFromDB(caseId);

    await caseUtils.deleteCaseFromCharityCasesArray(charity, idx);

    return {
        deletedCase,
    };
};

const editCase = async (charity, caseData: Case & { image: string }, caseId: string) => {
    caseUtils.checkIfCaseBelongsToCharity(charity.cases, caseId);

    let deleteOldImg: (() => void) | null = null;
    if (caseData.image) {
        deleteOldImg = await caseUtils.replaceCaseImg(caseData, caseId);
    }

    let updatedCase: CaseDocument = await caseUtils.editCase(caseData, caseId);

    if (deleteOldImg) deleteOldImg();

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
