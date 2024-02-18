import {
    BadRequestError,
    NotFoundError,
} from '../../../libraries/errors/components/index.js';
import { charityRepository } from '../data-access/charity.repository.js';
import {
    generateResetTokenTemp,
    setupMailSender,
} from '../../../utils/mailer.js';
import { checkValueEquality } from '../../../utils/shared.js';
import { deleteOldImgs } from '../../../utils/deleteFile.js';

const checkCharityIsExist = async (email) => {
    //return charity if it exists
    const charityIsExist = await charityRepository.findCharity(email);
    if (!charityIsExist) {
        throw new NotFoundError('email not found Please use another one');
    }
    return {
        charity: charityIsExist,
    };
};
const logout = (res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
};
const getCharity = (req) => {
    return { charity: req.charity };
};
const checkIsEmailDuplicated = async (email) => {
    const isDuplicatedEmail = await charityRepository.findCharity(email);
    if (isDuplicatedEmail) throw new BadRequestError('Email is already taken!');
};
const changeCharityEmailWithMailAlert = async (
    CharityBeforeUpdate,
    newEmail
) => {
    //for sending email if changed or edited
    CharityBeforeUpdate.email = newEmail;
    CharityBeforeUpdate.emailVerification.isVerified = false;
    CharityBeforeUpdate.emailVerification.verificationDate = null;
    const token = await generateResetTokenTemp();
    CharityBeforeUpdate.verificationCode = token;
    await setupMailSender(
        CharityBeforeUpdate.email,
        'email changed alert',
        `hi ${CharityBeforeUpdate.name}email has been changed You must Re activate account ` +
            `<h3>(www.activate.com)</h3>` +
            `<h3>use that token to confirm the new password</h3> <h2>${token}</h2>`
    );
    await CharityBeforeUpdate.save();
    return { charity: CharityBeforeUpdate };
};
const verifyCharityAccount = async (charity) => {
    charity.verificationCode = null;
    charity.emailVerification.isVerified = true;
    charity.emailVerification.verificationDate = Date.now();
    await charity.save();
};
const resetSentToken = async (charity) => {
    charity.verificationCode = null;
    await charity.save();
};
const setTokenToCharity = async (charity, token) => {
    charity.verificationCode = token;
    await charity.save();
};
const changePassword = async (charity, newPassword) => {
    charity.password = newPassword;
    await charity.save();
};
const changeCharityPasswordWithMailAlert = async (charity, newPassword) => {
    await changePassword(charity, newPassword);
    await resetSentToken(charity); //after saving and changing the password
    await setupMailSender(
        charity.email,
        'password changed alert',
        `hi ${charity.name} <h3>contact us if you did not changed the password</h3>` +
            `<h3>go to link(www.dummy.com) to freeze your account</h3>`
    );
};
const editCharityProfileAddress = async (charity, id, updatedLocation) => {
    for (let i = 0; i < charity.location.length; i++) {
        const isMatch = checkValueEquality(charity.location[i]._id, id);
        if (isMatch) {
            // charity.location[i] = updatedLocation;//make a new id
            const { governorate, city, street } = updatedLocation;
            governorate
                ? (charity.location[i].governorate = governorate)
                : null;
            city ? (charity.location[i].city = city) : null;
            street ? (charity.location[i].street = street) : null;
            await charity.save();
            return { charity: charity };
        }
    } //not match any location id
    throw new BadRequestError('no id found');
};
// };
const addCharityProfileAddress = async (charity, updatedLocation) => {
    charity.location.push(updatedLocation);
    await charity.save();
    return { charity: charity };
};

const replaceProfileImage = async (charity, oldImg, newImg) => {
    charity.image = newImg;
    console.log(oldImg);
    await charity.save();
    deleteOldImgs('charityLogos', oldImg);
    return { image: charity.image };
};
const addDocs = async (reqBody, charity) => {
    charity.charityDocs = { ...reqBody.charityDocs }; //assign the docs
    if (!reqBody.paymentMethods) {
        throw new BadRequestError(
            'must send one of payment gateways inforamtions..'
        );
    }
    if (reqBody.paymentMethods.bankAccount)
        await addPaymentAccounts(reqBody, charity, 'bankAccount');
    if (reqBody.paymentMethods.fawry)
        await addPaymentAccounts(reqBody, charity, 'fawry');
    if (reqBody.paymentMethods.vodafoneCash)
        await addPaymentAccounts(reqBody, charity, 'vodafoneCash');
    await makeCharityIsPending(charity); // update and save changes
    console.log(charity.paymentMethods);
    return { paymentMethods: charity.paymentMethods };
};
const makeCharityIsPending = async (charity) => {
    charity.isPending = true;
    await charity.save();
};
const addPaymentAccounts = async (accountObj, charity, type) => {
    if (charity.paymentMethods === undefined) charity.paymentMethods = {};
    if (type === 'bankAccount') {
        const { bankAccount } = accountObj.paymentMethods;
        const { accNumber, iban, swiftCode } = bankAccount[0];
        const bankDocs = bankAccount.bankDocs[0];
        const temp = {
            accNumber,
            iban,
            swiftCode,
            bankDocs,
        };
        if (accNumber && iban && swiftCode && bankDocs) {
            charity.paymentMethods['bankAccount'].push(temp);
        } else {
            throw new BadRequestError('must provide complete information');
        }
    }
    if (type === 'fawry') {
        const { fawry } = accountObj.paymentMethods;
        const { number } = fawry[0];
        const fawryDocs = fawry.fawryDocs[0];
        if (number && fawryDocs) {
            const temp = {
                number,
                fawryDocs,
            };
            charity.paymentMethods['fawry'].push(temp);
        } else {
            throw new BadRequestError('must provide complete information');
        }
    }
    if (type === 'vodafoneCash') {
        const { vodafoneCash } = accountObj.paymentMethods;
        const { number } = vodafoneCash[0];
        const vodafoneCashDocs = vodafoneCash.vodafoneCashDocs[0];
        if (number && vodafoneCashDocs) {
            const temp = {
                number,
                vodafoneCashDocs,
            };
            charity.paymentMethods['vodafoneCash'].push(temp);
        } else {
            throw new BadRequestError('must provide complete information');
        }
    }
    await charity.save();
};

const getChangedPaymentMethod = (reqPaymentMethodsObj) => {
    let changedPaymentMethod;

    ['bankAccount', 'fawry', 'vodafoneCash'].forEach((pm) => {
        if (reqPaymentMethodsObj[pm]) changedPaymentMethod = pm;
    });

    return changedPaymentMethod;
};

const getPaymentMethodIdx = (
    charityPaymentMethodsObj,
    changedPaymentMethod,
    paymentId
) => {
    const idx = charityPaymentMethodsObj[changedPaymentMethod].findIndex(
        (paymentMethods) => paymentMethods._id.toString() === paymentId
    );

    return idx;
};

const makeTempPaymentObj = (selector, reqPaymentMethodsObj) => {
    const temp = {};

    const methodMap = {
        bankAccount: {
            fields: ['accNumber', 'iban', 'swiftCode'], // ??
            docsField: 'bankDocs',
        },
        fawry: {
            fields: ['number'],
            docsField: 'fawryDocs',
        },
        vodafoneCash: {
            fields: ['number'],
            docsField: 'vodafoneCashDocs',
        },
    };

    if (methodMap.hasOwnProperty(selector)) {
        const { fields, docsField } = methodMap[selector];
        const methodData = reqPaymentMethodsObj[selector][0];

        fields.forEach((field) => {
            temp[field] = methodData[field];
        });

        temp[docsField] = methodData[docsField][0];
    }

    return temp;
};

const swapPaymentInfo = (charityPaymentMethodsObj, temp, selector, idx) => {
    for (let key in temp) {
        if (key.endsWith('docs')) {
            deleteOldImgs(
                'charityDocs',
                charityPaymentMethodsObj[selector][idx][key]
            );

            charityPaymentMethodsObj[selector][idx][key] = [temp[key]];
        } else charityPaymentMethodsObj[selector][idx][key] = temp[key];
    }

    charityPaymentMethodsObj[selector][idx].enable = false;
};

const addNewPayment = (charityPaymentMethodsObj, temp, selector) => {
    charityPaymentMethodsObj[selector].push(temp);
};

export const charityUtils = {
    checkCharityIsExist,
    logout,
    changeCharityPasswordWithMailAlert,
    getCharity,
    checkIsEmailDuplicated,
    verifyCharityAccount,
    resetSentToken,
    setTokenToCharity,
    changeCharityEmailWithMailAlert,
    editCharityProfileAddress,
    addCharityProfileAddress,
    replaceProfileImage,
    addDocs,
    getChangedPaymentMethod,
    getPaymentMethodIdx,
    makeTempPaymentObj,
    swapPaymentInfo,
    addNewPayment,
};
