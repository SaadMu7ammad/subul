import { caseService } from './case.service.js';

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
    const queryParams = req.query;
    const charityId = req.charity._id;
    const responseData = await caseService.getAllCases(charityId, queryParams);

    res.json({
        cases: responseData.cases,
        message: 'All Cases fetched Successfully',
    });
};

export const caseUseCase = { addCase, getAllCases };
