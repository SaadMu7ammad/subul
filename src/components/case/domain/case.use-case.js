import {caseService} from './case.service.js';

const addCase = async (req, res, next) => {
    const caseData = req.body;
    const caseImage = req.body.image[0];
    const charity = req.charity;
    const responseData = await caseService.addCase(
        caseData,
        caseImage,
        charity
    );

    return {
        case: responseData.case,
        message: 'Case Created Successfully',
    };
};

const getAllCases = async (req, res, next) => {
    //ToDo : Sanitizing Req Query Params
    ///////Sorting//////
    const sortBy = req.query.sort || 'upVotes';
    const sortArray = sortBy.split(',');
    const sortObject = {};
    sortArray.forEach(function (sort) {
        if (sort[0] === '-') {
            sortObject[sort.substring(1)] = -1;
        } else {
            sortObject[sort] = 1;
        }
    });
    ///////Filtering///////
    const filterObject = { charity: req.charity._id };
    const queryParameters = ['mainType', 'subType', 'nestedSubType'];

    for (const param of queryParameters) {
        if (req.query[param]) {
            filterObject[param] = req.query[param];
        }
    }
    //////Paginating/////
    const pageLimit = +req.query.limit || 10;
    const page = +req.query.page || 1;
    ///////////////////////
    const charityCases = await Case.aggregate([
        {
            $match: filterObject,
        },
        {
            $sort: sortObject,
        },
    ])
        .skip((page - 1) * pageLimit)
        .limit(pageLimit)
        .project(
            '-gender -upVotes -views -dateFinished -donationNumbers -helpedNumbers -freezed -createdAt -updatedAt -__v'
        );

    res.json(charityCases);
};

export const caseUseCase = { addCase };
