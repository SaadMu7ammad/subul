import { caseRepository } from '../data-access/case.repository.js';

const createCase = async (caseData) => {
    return await caseRepository.createCase(caseData);
};

const getSortObj = () => {
    const sortBy = req.query.sort || 'upVotes';

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

const getFilterObj = () => {
    const filterObject = { charity: req.charity._id };

    const queryParameters = ['mainType', 'subType', 'nestedSubType'];

    for (const param of queryParameters) {
        if (req.query[param]) {
            filterObject[param] = req.query[param];
        }
    }

    return filterObject;
};

const getCasesPagination = () => {
    const pageLimit = +req.query.limit || 10;

    const page = +req.query.page || 1;

    return { pageLimit, page };
};

const getAllCases = async()=>{
    
}

export const caseUtils = {
    createCase,
    getSortObj,
    getFilterObj,
    getCasesPagination,
    getAllCases
};
