import Charity from '../models/charityModel.js';
import { deleteOldImgs } from '../utils/deleteFile.js';
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

const rejectingCharity = async (charity) => {
    charity.isPending = false;
    charity.isConfirmed = false;
    for(let i = 1 ; i<=4;++i){
        deleteOldImgs(charity.charityDocs['docs'+i]);
        charity.charityDocs['docs'+i]=[];
    }

    charity.paymentMethods.bankAccount.map((acc) => {
        console.log('loop');
        // acc.docsBank.map(img => {
        //   console.log(img);
        deleteOldImgs(acc.docsBank);

        // })
    });
    charity.paymentMethods.fawry.map((acc) => {
        console.log('loop');
        // acc.docsBank.map(img => {
        //   console.log(img);
        deleteOldImgs(acc.docsFawry);
        // })
    });
    charity.paymentMethods.vodafoneCash.map((acc) => {
        console.log('loop');

        deleteOldImgs(acc.docsVodafoneCash);
        // })
    });
    await charity.save();
};
export { getPendingCharity, confirmingCharity,rejectingCharity };
