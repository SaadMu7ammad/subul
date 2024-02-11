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

export const caseUtils = {
    createCase,
    getSortObj,
    getFilterObj,
    getCasesPagination,
    getAllCases,
};
