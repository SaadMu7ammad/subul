import { NotFoundError } from '../../../libraries/errors/components/not-found.js';
import { deleteOldImgs } from '../../../utils/deleteFile.js';
import { caseRepository } from '../data-access/case.repository.js';

const createCase = async (caseData) => {
    return await caseRepository.createCase(caseData);
};

const getSortObj = (sortQueryParams) => {
    const sortBy = sortQueryParams || 'upVotes';

    const sortArray = sortBy.split(',');

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

const getFilterObj = (charityId, queryParams) => {
    const filterObject = { charity: charityId };

    const filterQueryParameters = ['mainType', 'subType', 'nestedSubType'];

    for (const param of filterQueryParameters) {
        if (queryParams[param]) {
            filterObject[param] = queryParams[param];
        }
    }

    return filterObject;
};

const getCasesPagination = (queryParams) => {
    const pageLimit = +queryParams.limit || 10;

    const page = +queryParams.page || 1;

    return { pageLimit, page };
};

const getAllCases = async (sortObj, filterObj, page, pageLimit) => {
    const cases = await caseRepository.getAllCases(
        sortObj,
        filterObj,
        page,
        pageLimit
    );

    return cases;
};

const getCaseByIdFromDB = async (caseId) => {
    const _case = await caseRepository.getCaseById(caseId);

    if (!_case) throw new NotFoundError('No Such Case With this Id!');

    return _case;
};

const checkIfCaseBelongsToCharity = (charityCasesArray, caseId) => {
    const idx = charityCasesArray.findIndex(function (id) {
        return id.toString() === caseId;
    });

    if (idx === -1) {
        throw new NotFoundError('No Such Case With this Id!');
    }

    return idx;
};

const deleteCaseFromDB = async (id) => {
    const deletedCase = await caseRepository.deleteCaseById(id);

    if (!deletedCase) {
        throw new NotFoundError('No Such Case With this Id!');
    }

    deleteOldImgs('casesCoverImages', deletedCase.imageCover);

    return deletedCase;
};

const deleteCaseFromCharityCasesArray = async (charity, idx) => {
    const caseIdsArray = charity.cases;

    caseIdsArray.splice(idx, 1);

    charity.cases = caseIdsArray;

    await charity.save();
};

const editCase = async (caseData, caseId) => {
    const updatedCase = await caseRepository.editCase(caseData, caseId);

    return updatedCase;
};

const replaceCaseImg = async (caseData, caseId) => {
    caseData.imageCover = caseData.image[0];

    const caseObject = await caseRepository.getCaseById(caseId);

    let oldCoverImage = caseObject.imageCover;

    return deleteOldImgs.bind(this,'casesCoverImages', oldCoverImage);
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
