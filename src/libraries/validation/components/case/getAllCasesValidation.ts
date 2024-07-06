import { Request } from 'express';
import { query } from 'express-validator';

const getAllCasesValidation = (req: Request) => [
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
      'donationNumbers',
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
      '-donationNumbers',
      '-helpedNumbers',
      '-targetDonationAmount',
      '-currentDonationAmount',
    ])
    .withMessage(req.t('errors.invalidSort')),
  query('mainType')
    .optional()
    .isIn([
      'Sadaqa',
      'Zakah',
      'BloodDonation',
      'kafarat',
      'Adahi',
      'Campaigns',
      'UsedProperties',
      'customizedCampaigns',
    ])
    .withMessage(req.t('errors.invalidMainType')),
  query('subType')
    .optional()
    .isIn([
      'Aqeeqa',
      'BloodDonation',
      'Campaigns',
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
      'customizedCampaigns',
    ])
    .withMessage(req.t('errors.invalidSubType')),
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
export { getAllCasesValidation };
