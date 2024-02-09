import { param, query } from 'express-validator';

const getAllCasesValidation = [
    query('sort')
        .optional()
        .isIn([
            'title',
            'mainType',
            'subType',
            'nestedSubType',
            'upVotes',
            'views',
            'dateFinished',
            'dontationNumbers',
            'helpedNumbers',
            'targetDonationAmount',
            'currentDonationAmount',
            'createdAt',
            'updatedAt',
            '-createdAt',
            '-updatedAt',
            '-title',
            '-mainType',
            '-subType',
            '-nestedSubType',
            '-upVotes',
            '-views',
            '-dateFinished',
            '-dontationNumbers',
            '-helpedNumbers',
            '-targetDonationAmount',
            '-currentDonationAmount',
        ])
        .withMessage('Invalid Sort Parameter!'),
    query('mainType')
        .optional()
        .isIn([
            'Sadaqa',
            'Zakah',
            'BloodDonation',
            'kafarat',
            'Adahi',
            'Campains',
            'UsedProperties',
        ])
        .withMessage('Invalid mainType!'),
    query('subType')
        .optional()
        .isIn([
            'Aqeeqa',
            'BloodDonation',
            'Campains',
            'Yameen',
            'Fediat Siam',
            'Foqaraa',
            'Masakeen',
            'Gharemat',
            'Soqia Maa',
            'Health',
            'General Support',
            'Adahy',
            'usedBefore',
        ])
        .withMessage('Invalid subType!'),
    query('nestedSubType')
        .optional()
        .isIn([
            'Wasla',
            'Hafr Beer',
            'Burns',
            'Operations & AssistiveDevices',
            'Mini Projects',
            'General Support',
        ])
        .withMessage('Invalid nestedSubType!'),
    query('page').optional().isNumeric().withMessage('Invalid page!'),
    query('limit').optional().isNumeric().withMessage('Invalid limit!'),
];
export {getAllCasesValidation};
