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

    return {
        cases: responseData.cases,
        message: 'All Cases fetched Successfully',
    };
};

const getCaseById = async (req, res, next) => {
    const charityCases = req.charity.cases;
    const caseId = req.params.caseId;

    const responseData = await caseService.getCaseById(charityCases, caseId);

    return {
        case: responseData.case,
        message: 'Case Fetched Successfully',
    };
};

const deleteCase = async (req, res, next) => {
    const charity = req.charity;

    const caseId = req.params.caseId;

    const responseData = await caseService.deleteCase(charity, caseId);

    return {
        deletedCase: responseData.deletedCase,
        message: 'Case Deleted Successfully',
    };
};

export const caseUseCase = { addCase, getAllCases, getCaseById, deleteCase };
