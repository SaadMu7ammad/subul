import { NotFoundError } from '../../../libraries/errors/components/not-found.js';
import { deleteOldImgs } from '../../../utils/deleteFile.js';
import { CaseRepository } from '../data-access/case.repository.js';
import {
    FilterObj,
    GetAllCasesQueryParams,
    SortObj,
    ICase,
    PaginationObj,
    ICaseDocument
} from '../data-access/interfaces/case.interface.js';

const caseRepository = new CaseRepository();

const createCase = async (caseData: ICase) => {
    return await caseRepository.createCase(caseData);
};

const getSortObj = (sortQueryParams: string|undefined): SortObj => {
    const sortBy: string = sortQueryParams || 'upVotes';

    const sortArray: string[] = sortBy.split(',');

    const sortObj: SortObj = {};
    sortArray.forEach(function (sort) {
        if (sort[0] === '-') {
            sortObj[sort.substring(1)] = -1;
        } else {
            sortObj[sort] = 1;
        }
    });

    return sortObj;
};

const getFilterObj = (
    charityId: string,
    queryParams:GetAllCasesQueryParams 
): FilterObj => {
    const filterObject: FilterObj = { charity: charityId };

    const filterQueryParameters: string[] = [
        'mainType',
        'subType',
        'nestedSubType',
    ];

    for (const param of filterQueryParameters) {
        if (queryParams[param]) {
            filterObject[param] = queryParams[param];
        }
    }

    return filterObject;
};

const getCasesPagination = (
    queryParams:GetAllCasesQueryParams 
): PaginationObj => {
    const limit = queryParams?.limit ? +queryParams.limit : 10;

    const page = queryParams?.page ? +queryParams.page: 1;

    return { limit, page };
};

const getAllCases = async (sortObj: SortObj, filterObj: FilterObj, page: number, limit: number) => {
    const cases: ICaseDocument[] = await caseRepository.getAllCases(
        sortObj,
        filterObj,
        page,
        limit
    );

    return cases;
};

const getCaseByIdFromDB = async (caseId: string): Promise<ICaseDocument> => {
    const _case: ICaseDocument | null = await caseRepository.getCaseById(caseId);

    if (!_case) throw new NotFoundError('No Such Case With this Id!');

    return _case;
};

const checkIfCaseBelongsToCharity = (charityCasesArray, caseId: string): number => {
    const idx: number = charityCasesArray.findIndex(function (id) {
        return id.toString() === caseId;
    });

    if (idx === -1) {
        throw new NotFoundError('No Such Case With this Id!');
    }

    return idx;
};

const deleteCaseFromDB = async (id: string) => {
    const deletedCase: ICaseDocument|null = await caseRepository.deleteCaseById(id);

    if (!deletedCase) {
        throw new NotFoundError('No Such Case With this Id!');
    }

    deleteOldImgs('caseCoverImages', deletedCase.coverImage);

    return deletedCase;
};

const deleteCaseFromCharityCasesArray = async (charity, idx: number) => {
    const caseIdsArray: string[] = charity.cases;

    caseIdsArray.splice(idx, 1);

    charity.cases = caseIdsArray;

    await charity.save();
};

const editCase = async (caseData: ICase, caseId: string) => {
    const updatedCase: ICaseDocument|null = await caseRepository.editCase(caseData, caseId);

    if(!updatedCase) throw new NotFoundError('No Such Case With this Id!');

    return updatedCase;
};

const replaceCaseImg = async (caseData, caseId: string) => {
    caseData.coverImage = caseData.image[0];

    const caseObject: ICaseDocument|null = await caseRepository.getCaseById(caseId);

    if (!caseObject) throw new NotFoundError('No Such Case With this Id!');

    let oldCoverImage: string = caseObject.coverImage;

    return deleteOldImgs.bind(this, 'caseCoverImages', oldCoverImage);
};

export const caseUtils = {
    createCase,
    getSortObj,
    getFilterObj,
    getCasesPagination,
    getAllCases,
    getCaseByIdFromDB,
    checkIfCaseBelongsToCharity,
    deleteCaseFromCharityCasesArray,
    deleteCaseFromDB,
    editCase,
    replaceCaseImg,
};
