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

export const caseUseCase = { addCase };
