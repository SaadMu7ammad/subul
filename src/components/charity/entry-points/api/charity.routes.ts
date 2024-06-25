import { auth, isActivated, isConfirmed } from '@components/auth/shared/index';
import { charityUseCaseClass } from '@components/charity/domain/charity.use-case';
import { tranactionUseCaseClass } from '@components/transaction/domain/transaction.use-case';
import { usedItemUseCase } from '@components/used-items/domain/used-item.use-case';
import { resizeDoc, uploadDocs } from '@libs/uploads/components/docs/images/handler';
import { resizeDocReq, uploadDocsReq } from '@libs/uploads/components/docs/images/handler2';
import { imageAssertion, resizeImg } from '@libs/uploads/components/images/handlers';
import {
  changePasswordCharityValidation,
  confirmResetCharityValidation,
  requestResetEmailCharityValidation,
  tokenCharityValidation,
} from '@libs/validation/components/charity/allCharityValidation';
import {
  editCharityProfileValidation,
  reqEditPaymentMethodsValidation,
} from '@libs/validation/components/charity/editCharityProfileValidation';
import { validate } from '@libs/validation/index';
import { deleteOldImgs } from '@utils/deleteFile';
import logger from '@utils/logger';
import express, { Application, NextFunction, Request, Response } from 'express';

export default function defineRoutes(expressApp: Application) {
  const charityUseCaseInstance = new charityUseCaseClass();
  const router = express.Router();
  router.post(
    '/activate',
    tokenCharityValidation,
    validate,
    auth,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`Charity API was called to Activate Account`);
        const activateCharityAccountResponse = await charityUseCaseInstance.activateCharityAccount(
          req,
          res,
          next
        );
        return res.json(activateCharityAccountResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );
  router.post(
    '/reset',
    requestResetEmailCharityValidation,
    validate,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`Charity API was called to Reset Password`);
        const requestResetPasswordResponse = await charityUseCaseInstance.requestResetPassword(
          req,
          res,
          next
        );
        return res.json(requestResetPasswordResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );
  router.post(
    '/reset/confirm',
    confirmResetCharityValidation,
    validate,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`Charity API was called to Confirm Reset Password`);
        const confirmResetPasswordResponse = await charityUseCaseInstance.confirmResetPassword(
          req,
          res,
          next
        );
        return res.json(confirmResetPasswordResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );
  router.post(
    '/change-password',
    changePasswordCharityValidation,
    validate,
    auth,
    isActivated,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`Charity API was called to Change Password`);
        const changePasswordResponse = await charityUseCaseInstance.changePassword(req, res, next);
        return res.json(changePasswordResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );
  // // const upload = multer({ dest: 'uploads/charityDocs/' });
  router.post('/logout', (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info(`Charity API was called to logout`);
      const logoutResponse = charityUseCaseInstance.logout(req, res, next);
      return res.json(logoutResponse);
    } catch (error) {
      next(error);
      return undefined;
    }
  });
  router.get('/profile', auth, (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info(`Charity API was called to Show Profile`);
      const showCharityProfileResponse = charityUseCaseInstance.showCharityProfile(req, res, next);
      return res.json(showCharityProfileResponse);
    } catch (error) {
      next(error);
      return undefined;
    }
  });
  //should add edit image in a separate api
  router.put(
    '/edit-profile',
    auth,
    isActivated,
    isConfirmed,
    editCharityProfileValidation,
    validate,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`Charity API was called to Edit Profile`);
        const changePasswordResponse = await charityUseCaseInstance.editCharityProfile(
          req,
          res,
          next
        );
        return res.json(changePasswordResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );
  router.put(
    '/edit-profileImg',
    auth,
    isActivated,
    isConfirmed,
    imageAssertion,
    resizeImg,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`Charity API was called to Edit Profile Img`);
        const changeProfileImageResponse = await charityUseCaseInstance.changeProfileImage(
          req,
          res,
          next
        );
        return res.json(changeProfileImageResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );

  router.post(
    '/request-edit-payment',
    uploadDocsReq,
    auth,
    isActivated,
    isConfirmed,
    reqEditPaymentMethodsValidation,
    validate,
    resizeDocReq,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`Charity API was called to Request Edit Payments`);
        const editCharityPaymentResponse = await charityUseCaseInstance.requestEditCharityPayments(
          req,
          res,
          next
        );
        return res.json(editCharityPaymentResponse);
      } catch (error) {
        deleteOldImgs('charityDocs', req?.body?.paymentMethods?.bankAccount?.bankDocs);
        deleteOldImgs('charityDocs', req?.body?.paymentMethods?.fawry?.fawryDocs);
        deleteOldImgs('charityDocs', req?.body?.paymentMethods?.vodafoneCash?.vodafoneCashDocs);
        next(error);
        return undefined;
      }
    }
  );

  router.post(
    '/send-docs',
    uploadDocs,
    auth,
    reqEditPaymentMethodsValidation,
    validate,
    resizeDoc,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`Charity API was called to Send Docs`);
        const sendDocsResponse = await charityUseCaseInstance.sendDocs(req, res, next);
        return res.json(sendDocsResponse);
      } catch (error) {
        deleteOldImgs('charityDocs', req?.body?.charityDocs?.docs1);
        deleteOldImgs('charityDocs', req?.body?.charityDocs?.docs2);
        deleteOldImgs('charityDocs', req?.body?.charityDocs?.docs3);
        deleteOldImgs('charityDocs', req?.body?.charityDocs?.docs4);
        deleteOldImgs('charityDocs', req?.body?.paymentMethods?.bankAccount?.bankDocs);
        deleteOldImgs('charityDocs', req?.body?.paymentMethods?.fawry?.fawryDocs);
        deleteOldImgs('charityDocs', req?.body?.paymentMethods?.vodafoneCash?.vodafoneCashDocs);

        next(error);
        return undefined;
      }
    }
  );

  router.post(
    '/bookUsedItem/:id',
    auth,
    isActivated,
    isConfirmed,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`Used Items API was called to Get All Used Items`);
        const bookUsedItemResponse = await usedItemUseCase.bookUsedItem(req, res);
        return res.json(bookUsedItemResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );

  router.post(
    '/cancelBookingOfUsedItem/:id',
    auth,
    isActivated,
    isConfirmed,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`Used Items API was called to Cancel Booking Of Used Items`);
        const cancelBookingOfUsedItemResponse = await usedItemUseCase.cancelBookingOfUsedItem(
          req,
          res
        );
        return res.json(cancelBookingOfUsedItemResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );

  router.post(
    '/confirmBookingReceipt/:id',
    auth,
    isActivated,
    isConfirmed,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`Used Items API was called to Confirm Booking Receipt`);
        const confirmBookingReceiptResponse = await usedItemUseCase.ConfirmBookingReceipt(req, res);
        return res.json(confirmBookingReceiptResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );

  router.get(
    '/charityTransactionsLogs',
    auth,
    isActivated,
    isConfirmed,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        logger.info(`charity API was called to get transactions donation for the charity`);
        const transactionUseCaseInstance = new tranactionUseCaseClass();
        const getAllTransactionsResponse =
          await transactionUseCaseInstance.getAllTransactionsToCharity(req, res, next);
        return res.json(getAllTransactionsResponse);
      } catch (error) {
        next(error);
        return undefined;
      }
    }
  );

  expressApp.use('/api/charities', router);
}
