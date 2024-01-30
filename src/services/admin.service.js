import Charity from '../components/charity/data-access/models/charity.model.js';
import { deleteOldImgs } from '../utils/deleteFile.js';
import { BadRequestError } from '../libraries/errors/components/bad-request.js';
const getPendingCharities = async (id) => {
    const queryObject = {
        $and: [
            { isPending: true },
            { isEnabled: true },
            {
                $or: [
                    { 'emailVerification.isVerified': true },
                    { 'phoneVerification.isVerified': true },
                ],
            },
        ],
    };
    if (id) queryObject._id = id;
    const charities = await Charity.find(queryObject)
        .select('name email charityDocs paymentMethods')
        .exec();
    if (id && !charities[0]) throw new BadRequestError('charity not found');
    return id ? charities[0] : charities;
};

const getConfirmedCharities = async (id) => {
    const queryObject = {
        $and: [
            { isPending: false },
            { isEnabled: true },
            { isConfirmed: true },
            {
                $or: [
                    { 'emailVerification.isVerified': true },
                    { 'phoneVerification.isVerified': true },
                ],
            },
        ],
    };
    if (id) queryObject._id = id;
    const charities = await Charity.find(queryObject)
        .select('name email paymentMethods')
        .exec();
    if (id && !charities[0]) throw new BadRequestError('charity not found');
    return id ? charities[0] : charities;
};

const confirmingCharity = async (charity) => {
    charity.isPending = false;
    charity.isConfirmed = true;
    //enable all paymentMethods when first time the charity send the docs
    charity.paymentMethods.bankAccount.forEach((item) => {
        item.enable = true;
    });
    charity.paymentMethods.fawry.forEach((item) => {
        item.enable = true;
    });
    charity.paymentMethods.vodafoneCash.forEach((item) => {
        item.enable = true;
    });
    // deleteOldImgs(arr)
    await charity.save();
};

const rejectingCharity = async (charity) => {
    charity.isPending = false;
    charity.isConfirmed = false;

    for (let i = 1; i <= 4; ++i) {
        deleteOldImgs('docsCharities', charity.charityDocs['docs' + i]);
    }
    charity.charityDocs = {};

    const paymentMethods = new Map([
        ['bankAccount', 'docsBank'],
        ['fawry', 'docsFawry'],
        ['vodafoneCash', 'docsVodafoneCash'],
    ]);

    for (let [method, docs] of paymentMethods) {
        charity.paymentMethods[method]?.forEach((acc) => {
            deleteOldImgs('docsCharities', acc[docs]);
        });
        charity.paymentMethods[method] = [];
    }

    await charity.save();
};

const checkPaymentMethodAvailability = (
    charity,
    paymentMethod,
    paymentAccountID
) => {
    if (
        paymentMethod !== 'bankAccount' &&
        paymentMethod !== 'vodafoneCash' &&
        paymentMethod !== 'fawry'
    ) {
        throw new BadRequestError('Invalid Payment Method type');
    }

    const idx = charity.paymentMethods[paymentMethod].findIndex(
        (item) => item._id == paymentAccountID
    );

    if (idx === -1)
        throw new BadRequestError('not found Payment Method account');

    return idx;
};

const rejectingPaymentAccount = async (charity, paymentMethod, idx) => {
    if (charity.paymentMethods[paymentMethod][idx].enable === true)
        throw new BadRequestError('Already this payment account is enabled');

    let urlOldImage;

    if (paymentMethod === 'bankAccount') {
        urlOldImage = charity.paymentMethods[paymentMethod][idx].docsBank;
    } else if (paymentMethod === 'vodafoneCash') {
        urlOldImage =
            charity.paymentMethods[paymentMethod][idx].docsVodafoneCash;
    } else if (paymentMethod === 'fawry') {
        urlOldImage = charity.paymentMethods[paymentMethod][idx].docsFawry;
    }

    charity.paymentMethods[paymentMethod].splice(idx, 1); //delete the account
    // url: 'http://localhost:5000/docsCharities/docsBank-name.jpeg';
    if (urlOldImage) {
        // const url = path.join('./uploads/docsCharities', charity.paymentMethods[paymentMethod][idx].docsFawry[0])
        // console.log(url);
        // deleteFile(url)
        deleteOldImgs('docsCharities', urlOldImage);
    } else {
        throw new BadRequestError('No docs found for that account');
    }

    await charity.save();
};

const confirmingPaymentAccount = async (charity, paymentMethod, idx) => {
    if (charity.paymentMethods[paymentMethod][idx].enable === false) {
        charity.paymentMethods[paymentMethod][idx].enable = true;
    } else {
        throw new BadRequestError('Already this payment account is enabled');
    }
    await charity.save();
};

const getAllPendingPaymentMethodsRequests = async (paymentMethod) => {
    const paymentMethodRequests = await Charity.aggregate([
        {
            $match: {
                isPending: false,
                isEnabled: true,
                isConfirmed: true,
                $or: [
                    { 'emailVerification.isVerified': true },
                    { 'phoneVerification.isVerified': true },
                ],
            },
        },
        {
            $unwind: `$paymentMethods.${paymentMethod}`,
        },
        {
            $match: {
                [`paymentMethods.${paymentMethod}.enable`]: false,
            },
        },
        {
            $project: {
                name: 1,
                [`paymentMethods.${paymentMethod}`]: 1,
            },
        },
    ]).exec();
    return paymentMethodRequests;
};

const getCharityPendingPaymentRequests = async (id) => {
    const paymentRequests = await Charity.findOne(
        { _id: id },
        'paymentMethods _id'
    ).select('-_id'); //remove the extra useless id around the paymentMethods{_id,paymentMethods:{bank:[],fawry:[],vodafoneCash:[]}}

    if (!paymentRequests) throw new BadRequestError('charity not found');

    let bankAccount = paymentRequests.paymentMethods.bankAccount.filter(
        (acc) => acc.enable === false
    );

    let fawry = paymentRequests.paymentMethods.fawry.filter(
        (acc) => acc.enable === false
    );

    let vodafoneCash = paymentRequests.paymentMethods.vodafoneCash.filter(
        (acc) => acc.enable === false
    );

    return { bankAccount, fawry, vodafoneCash };
};

export {
    getPendingCharities,
    confirmingCharity,
    rejectingCharity,
    getConfirmedCharities,
    checkPaymentMethodAvailability,
    confirmingPaymentAccount,
    rejectingPaymentAccount,
    getAllPendingPaymentMethodsRequests,
    getCharityPendingPaymentRequests,
};
