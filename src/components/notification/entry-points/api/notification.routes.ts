import express, { Application } from 'express';
import logger from '../../../../utils/logger.js';
import {auth,isActivated} from '../../../auth/shared/index.js';
import {notificationUseCase} from '../../domain/notification.use-case.js';

export default function defineRoutes(expressApp: Application) {
    const router = express.Router();

    router.get(
        '/',
        auth,
        isActivated,
        async (req, res, next) => {
            try {
                logger.info(
                    `Notification API was called to get all notifications`
                );
                const getAllNotificationsResponse = await notificationUseCase.getAllNotifications(
                    req,
                    res,
                    next
                );
                return res.json(getAllNotificationsResponse);
            } catch (error) {
                next(error);
                return undefined;
            }
        }
    );
    expressApp.use('/api/notifications', router);
}
