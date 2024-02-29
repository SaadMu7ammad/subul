import { caseUtils } from './case.utils.js';
import {
    ICase,
    ICaseDocument,
    FilterObj,
    GetAllCasesQueryParams,
    PaginationObj,
    SortObj,
} from '../data-access/interfaces/case.interface.js';
const addCase = async (caseData: ICase, image: string, charity) => {
    const newCase: ICaseDocument = await caseUtils.createCase({
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

const getCaseById = async (charityCases:ICaseDocument[], caseId: string) => {
    caseUtils.checkIfCaseBelongsToCharity(charityCases, caseId);

    const _case: ICaseDocument = await caseUtils.getCaseByIdFromDB(caseId);

    return {
        case: _case,
    };
};

const deleteCase = async (charity, caseId: string) => {
    const idx: number = caseUtils.checkIfCaseBelongsToCharity(
        charity.cases,
        caseId
    );

    const deletedCase: ICaseDocument = await caseUtils.deleteCaseFromDB(caseId);

    await caseUtils.deleteCaseFromCharityCasesArray(charity, idx);

    return {
        deletedCase,
    };
};

const editCase = async (charity, caseData: ICase & { image: string }, caseId: string) => {
    caseUtils.checkIfCaseBelongsToCharity(charity.cases, caseId);

    let deleteOldImg: (() => void) | null = null;
    if (caseData.image) {
        deleteOldImg = await caseUtils.replaceCaseImg(caseData, caseId);
    }

    let updatedCase: ICaseDocument = await caseUtils.editCase(caseData, caseId);

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
