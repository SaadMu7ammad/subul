import { NotFoundError } from '../../../libraries/errors/components/not-found.js';
import { deleteOldImgs } from '../../../utils/deleteFile.js';
import { caseRepository } from '../data-access/case.repository.js';

const createCase = async (caseData) => {
    return await caseRepository.createCase(caseData);
};

const getSortObj = (sortQueryParams:string) => {
    const sortBy = sortQueryParams || 'upVotes';

    const sortArray :string[] = sortBy.split(',');

    const sortObj = {};

    sortArray.forEach(function (sort) {
        if (sort[0] === '-') {
            sortObj[sort.substring(1)] = -1;
        } else {
            sortObj[sort] = 1;
        }
    });

    return sortObj;
};

const getFilterObj = (charityId:string, queryParams) => {
    const filterObject = { charity: charityId };

    const filterQueryParameters = ['mainType', 'subType', 'nestedSubType'];

    for (const param of filterQueryParameters) {
        if (queryParams[param]) {
            filterObject[param] = queryParams[param];
        }
    }

    return filterObject;
};

const getCasesPagination = (queryParams:{page:number, limit:number}):{page:number, pageLimit:number} => {
    const pageLimit = +queryParams.limit || 10;

    const page = +queryParams.page || 1;

    return { pageLimit, page };
};

const getAllCases = async (sortObj, filterObj, page:number, pageLimit:number) => {
    const cases = await caseRepository.getAllCases(
        sortObj,
        filterObj,
        page,
        pageLimit
    );

    return cases;
};

const getCaseByIdFromDB = async (caseId:string) => {
    const _case = await caseRepository.getCaseById(caseId);

    if (!_case) throw new NotFoundError('No Such Case With this Id!');

    return _case;
};

const checkIfCaseBelongsToCharity = (charityCasesArray, caseId:string) => {
    const idx :number = charityCasesArray.findIndex(function (id) {
        return id.toString() === caseId;
    });

    if (idx === -1) {
        throw new NotFoundError('No Such Case With this Id!');
    }

    return idx;
};

const deleteCaseFromDB = async (id:string) => {
    const deletedCase = await caseRepository.deleteCaseById(id);

    if (!deletedCase) {
        throw new NotFoundError('No Such Case With this Id!');
    }

    deleteOldImgs('caseCoverImages', deletedCase.coverImage);

    return deletedCase;
};

const deleteCaseFromCharityCasesArray = async (charity, idx:number) => {
    const caseIdsArray :string[] = charity.cases;

    caseIdsArray.splice(idx, 1);

    charity.cases = caseIdsArray;

    await charity.save();
};

const editCase = async (caseData, caseId:string) => {
    const updatedCase = await caseRepository.editCase(caseData, caseId);

    return updatedCase;
};

const replaceCaseImg = async (caseData, caseId:string) => {
    caseData.coverImage = caseData.image[0];

    const caseObject = await caseRepository.getCaseById(caseId);

    if(!caseObject)throw new NotFoundError('No Such Case With this Id!');

    let oldCoverImage:string = caseObject.coverImage;

    return deleteOldImgs.bind(this,'caseCoverImages', oldCoverImage);
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
