import { query } from 'express-validator';
import { NotFoundError } from '../../../libraries/errors/components/not-found.js';
import { NotificationRepository } from '../data-access/notification.repository.js';
import mongoose from 'mongoose';
const notificationRepository = new NotificationRepository();

const getAllNotifications = async (filterObj, sortObj, paginationObj) => {
    const notifications = await notificationRepository.getAllNotifications(
        filterObj,
        sortObj,
        paginationObj
    );
    return notifications;
};

const markNotificationAsRead = async (
    receiverType: string,
    receiverId: string,
    notificationId: string
) => {
    const notification = await notificationRepository.getNotificationById(
        receiverType,
        receiverId,
        notificationId
    );

    if (!notification) throw new NotFoundError('Notification Not Found');

    notification.read = true;

    await notification.save();

    return notification;
};

const deleteNotification = async (
    receiverType: string,
    receiverId: string,
    notificationId: string
) => {
    const notification = await notificationRepository.getNotificationById(
        receiverType,
        receiverId,
        notificationId
    );

    if (!notification) throw new NotFoundError('Notification Not Found');

    const deletedNotification =
        await notificationRepository.deleteNotificationById(
            receiverType,
            receiverId,
            notificationId
        );

    if (!deletedNotification) throw new NotFoundError('Notification Not Found');

    return notification;
};

const getSortObj = (sortQueryParams: string | undefined) => {
    const sortBy: string = sortQueryParams || 'createdAt';

    const sortArray: string[] = sortBy.split(',');

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

const getPaginationObj = (queryParams) => {
    const limit = queryParams?.limit ? +queryParams.limit : 10;

    const page = queryParams?.page ? +queryParams.page : 1;

    return { limit, page };
};

const getFilterObj = (
    receiverType: string,
    receiverId: string,
    queryParams
) => {
    const filterObject = {
        'receiver.receiverType': receiverType,
        'receiver.receiverId': new mongoose.Types.ObjectId(receiverId),
    };

    const filterQueryParameters: string[] = ['read'];

    if(queryParams.read) {
        queryParams.read = queryParams.read === 'true'; 
    }

    for (const param of filterQueryParameters) {
        if (queryParams[param]!==undefined) {
            filterObject[param] = queryParams[param];
        }
    }

    return filterObject;
};

export const notificationUtils = {
    getAllNotifications,
    markNotificationAsRead,
    deleteNotification,
    getSortObj,
    getPaginationObj,
    getFilterObj,
};
