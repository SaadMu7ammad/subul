import Charity from '../models/charityModel.js';
const getPendingCharity = async (id) => {
    const charity = await Charity.findOne({
        _id: id,
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
    })
        .select('name email charityDocs paymentMethods')
        .exec();
    return charity;
};

const confirmingCharity = async (charity) => {
    charity.isPending = false;
    charity.isConfirmed = true;
    //enable all paymentMethods when first time the charity send the docs
    charity.paymentMethods.bankAccount.map((item) => {
        item.enable = true;
    });
    charity.paymentMethods.fawry.map((item) => {
        item.enable = true;
    });
    charity.paymentMethods.vodafoneCash.map((item) => {
        item.enable = true;
    });
    // deleteOldImgs(arr)
    await charity.save();
};

export {
    getPendingCharity,
    confirmingCharity,
}