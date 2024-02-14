import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import * as configurationProvider from '../../../../libraries/configuration-provider/index.js';
const Schema = mongoose.Schema;

const locationSchema = new mongoose.Schema({
  governorate: {
    type: String,
    enum: [
      'Alexandria',
      'Assiut',
      'Aswan',
      'Beheira',
      'Bani Suef',
      'Cairo',
      'Daqahliya',
      'Damietta',
      'Fayyoum',
      'Gharbiya',
      'Giza',
      'Helwan',
      'Ismailia',
      'Kafr El Sheikh',
      'Luxor',
      'Marsa Matrouh',
      'Minya',
      'Monofiya',
      'New Valley',
      'North Sinai',
      'Port Said',
      'Qalioubiya',
      'Qena',
      'Red Sea',
      'Sharqiya',
      'Sohag',
      'South Sinai',
      'Suez',
      'Tanta',
    ],
    required: true,
  },
  city: {
    type: String,
    required: false,
  },
  street: {
    type: String,
    required: false,
  },
});

const paymentMethodSchema = new Schema({
  bankAccount: [
    {
      enable: {
        //account is valid to use or not (freezed or in reviewing)
        type: Boolean,
        default: false,
      },
      accNumber: {
        type: String,
        // required: true,
      },
      iban: {
        type: String,
        // required: true,
      },
      swiftCode: {
        type: String,
        // required: true,
      },
      docsBank: {
        type: [String], // Define it as an array of strings
        // required: true, // The entire array is required
      },
    },
  ],
  fawry: [
    {
      enable: {
        type: Boolean,
        default: false,
      },
      number: {
        type: String,
        // required: true,
      },

      fawryDocs: {
        type: [String],
        // required: true,
      },
    },
  ],
  vodafoneCash: [
    {
      enable: {
        type: Boolean,
        default: false,
      },
      number: {
        type: String,
        // required: true,
      },

      vodafoneCashDocs: {
        type: [String],
        // required: true,
      },
    },
  ],
});
// paymentMethodSchema.path('bankAccount').validate(function (value) {
//   for (const bankAccount of value) {
//     if (bankAccount.accNumber && bankAccount.iban&&bankAccount.swiftCode) {
//       return true;
//     }
//   }
//   return false
// }, 'Validation input bank not completed');

// paymentMethodSchema.path('bankAccount').validate(function (value) {
//   return value.length > 0;
// }, 'At least one bank account must be provided.');

// paymentMethodSchema.path('fawry').validate(function (value) {
//   return value.length > 0;
// }, 'At least one fawry account must be provided.');

// paymentMethodSchema.path('vodafoneCash').validate(function (value) {
//   return value.length > 0;
// }, 'At least one vodafoneCash account must be provided.');

const charitySchema = new Schema(
  {
    cases: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Case',
      },
    ],
    image: {
      type: String,
      required: true, // Ensure it's required
    }, // profileImg: {},
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    contactInfo: {
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: Number,
        required: true,
      },
      websiteUrl: {
        type: String,
        required: true,
      },
    },
    description: {
      type: String,
      required: true,
    },
    totalDonationsIncome: {
      type: Number,
      default: 0,
    },
    verificationCode: {
      type: String,
      required: false,
      default: null,
    },
    emailVerification: {
      isVerified: {
        type: Boolean,
        default: false,
      },
      verificationDate: {
        type: Date,
        default: null,
      },
    },
    phoneVerification: {
      isVerified: {
        type: Boolean,
        default: false,
      },
      verificationDate: {
        type: Date,
        default: null,
      },
    },
    isEnabled: {
      //to freeze account or not
      type: Boolean,
      default: true,
      required: true,
    },
    isConfirmed: {
      //to confirm the docs of the charities
      type: Boolean,
      default: false,
      required: true,
    },
    isPending: {
      //to check if the charity sends its docs
      type: Boolean,
      default: false,
      required: true,
    },
    // modifyPaymentMethodsRequest: {
    //   //if the charity admin request to add a new payment account or edit existing one
    //   type: Boolean,
    //   default: false,
    //   required: true,
    // },
    paymentMethods: {
      type: paymentMethodSchema,
      // required: true,
    },
    rate: {
      type: Number,
      default: 0,
    },
    donorRequests: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'user',
          required: true,
        },
        requestTitle: {
          type: String,
          required: true,
        },
        requestMessage: {
          type: String,
          required: true,
        },
      },
    ],
    currency: [
      {
        type: String,
        required: true,
      },
    ],
    location: [{ type: locationSchema, required: true }],
    // files: [{}],
    charityInfo: {
      registeredNumber: {
        type: String,
        required: true,
      },
      establishedDate: {
        type: String,
        required: true,
      },
    },
    charityDocs: {
      docs1: [String],
      docs2: [String],
      docs3: [String],
      docs4: [String],
    },
    //, charityReqDocs: {
    //   docs: [String],
    // },
  },
  { timestamps: true }
);

charitySchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    //to not change password every time we edit the user data
    next();
  }
  const salt = await bcrypt.genSalt(
    configurationProvider.getValue('hashing.salt')
  );
  this.password = await bcrypt.hash(this.password, salt);
});
// const editImgUrl = (doc) => {
//   if (doc.image) {
//     const urlImg = `http://${configurationProvider.getValue(
//       'environment.host'
//     )}:${configurationProvider.getValue('environment.port')}/charityLogos/${
//       doc.image
//     }`;
//     doc.image = urlImg;
//   }
// };
// const editDocUrl = function (ref, field) {
//   ref[field].map((img, indx) => {
//     // console.log(img);//before adding localhost
//     const url = `http://${configurationProvider.getValue(
//       'environment.host'
//     )}:${configurationProvider.getValue(
//       'environment.port'
//     )}/charityDocs/${img}`;
//     img = url;
//     // console.log(img);//after adding localhost
//     ref[field][indx] = img;
//   });
// };
// const editDocUrlPayment = function (ref, field) {
//   // console.log(ref);
//   ref.forEach((account, index) => {
//     // console.log(account);
//     // account.forEach((img, indx) => {
//     // console.log(img);//before adding localhost
//     // console.log('acc=');
//     // console.log(account.docsBank[0]);
//     if (field === 'docsBank') {
//       console.log('editDocUrlPayment');
//       account.docsBank.forEach((sub, indx) => {
//         console.log('before ' + sub);
//         const url = `http://${configurationProvider.getValue(
//           'environment.host'
//         )}:${configurationProvider.getValue(
//           'environment.port'
//         )}/charityDocs/${sub}`;
//         sub = url;
//         account.docsBank[indx] = sub;
//         console.log('after ' + sub);
//       });
//       // account.docsBank[0] = url;
//     } else if (field === 'fawryDocs') {
//       account.fawryDocs.forEach((sub, indx) => {
//         // console.log(sub);
//         const url = `http://${configurationProvider.getValue(
//           'environment.host'
//         )}:${configurationProvider.getValue(
//           'environment.port'
//         )}/charityDocs/${sub}`;
//         sub = url;
//         account.fawryDocs[indx] = sub;
//       });
//     } else if (field === 'vodafoneCashDocs') {
//       account.vodafoneCashDocs.forEach((sub, indx) => {
//         // console.log(sub);
//         const url = `http://${configurationProvider.getValue(
//           'environment.host'
//         )}:${configurationProvider.getValue(
//           'environment.port'
//         )}/charityDocs/${sub}`;
//         sub = url;
//         account.vodafoneCashDocs[indx] = sub;
//       });
//     }

//     // console.log(img);//after adding localhost
//     // ref.account[index] =  account.docsBank;
//   });
//   // })
// };
// charitySchema.post('init', (doc) => {
//   //findone,findall,update
//   //after initialized the doc in db when a document is created or retrieved from the database.
//   console.log('after init');
//   // console.log('accessing data');
//   if (!doc.isModified('image')) {
//     console.log('NOTTT modifieddd');
//   } else {
//     console.log('modifieddd');
//     editImgUrl(doc);
//   }
//   // if (doc.paymentMethods && (doc.paymentMethods.bankAccount, 'docsBank')) {
//   //   console.log('xcxcxc');
//   //   editDocUrlPayment(doc.paymentMethods.bankAccount, 'docsBank');
//   // }
//   // if (doc.paymentMethods&&(doc.paymentMethods.fawry, 'fawryDocs')) {
//   //   editDocUrlPayment(doc.paymentMethods.fawry, 'fawryDocs');
//   // }
//   // if (doc.paymentMethods&&(doc.paymentMethods.vodafoneCash, 'vodafoneCashDocs')) {
//   //   editDocUrlPayment(doc.paymentMethods.vodafoneCash, 'vodafoneCashDocs');
//   // }
//   // if (
//   //   !doc.isModified('charityDocs[docs1]') &&
//   //   !doc.isModified('charityDocs[docs2]') &&
//   //   !doc.isModified('charityDocs[docs3]') &&
//   //   !doc.isModified('charityDocs[docs4]')
//   // ) {
//   //   console.log('NOTTT modifieddd docs');
//   //   console.log(doc.charityDocs.docs1);
//   //   // console.log(doc.image);
//   // } else {
//   //   console.log('modifieddd docs');
//   //   // console.log(doc.image);
//   //   editImgUrl(doc);
//   //   // console.log(doc.image);
//   // }
// });
// charitySchema.post('save', (doc) => {
//   //create
//   // after a new document is created and saved for the first time or when an existing document is updated and saved.  // console.log('after first time we create the data');
//   console.log('after created');
//   editImgUrl(doc);
//   if (
//     !doc.charityDocs.docs1 &&
//     !doc.charityDocs.docs2 &&
//     !doc.charityDocs.docs3 &&
//     !doc.charityDocs.docs4
//   ) {
//     // console.log(doc.charityDocs);
//     console.log('docs is empty');
//   } else {
//     editDocUrl(doc.charityDocs, 'docs1');
//     editDocUrl(doc.charityDocs, 'docs2');
//     editDocUrl(doc.charityDocs, 'docs3');
//     editDocUrl(doc.charityDocs, 'docs4');
//     // if (doc.paymentMethods&&(doc.paymentMethods.bankAccount, 'docsBank')) {
//     //   editDocUrlPayment(doc.paymentMethods.bankAccount, 'docsBank');
//     // }
//     // if (doc.paymentMethods&&(doc.paymentMethods.fawry, 'fawryDocs')) {
//     //   editDocUrlPayment(doc.paymentMethods.fawry, 'fawryDocs');
//     // }
//     // if (doc.paymentMethods&&(doc.paymentMethods.vodafoneCash, 'vodafoneCashDocs')) {
//     //   editDocUrlPayment(doc.paymentMethods.vodafoneCash, 'vodafoneCashDocs');
//     // }
//   }
// });

// charitySchema.pre('init', (doc) => {
//   if (!doc.charityDocs||
//     !doc.charityDocs.docs1 &&
//     !doc.charityDocs.docs2 &&
//     !doc.charityDocs.docs3 &&
//     !doc.charityDocs.docs4
//   ) {
//     // console.log(doc.charityDocs);
//     console.log('docs is empty');
//   } else {
//     editDocUrl(doc.charityDocs, 'docs1');
//     editDocUrl(doc.charityDocs, 'docs2');
//     editDocUrl(doc.charityDocs, 'docs3');
//     editDocUrl(doc.charityDocs, 'docs4');
//   }
//   if (doc.paymentMethods&&(doc.paymentMethods.bankAccount, 'docsBank')) {
//     editDocUrlPayment(doc.paymentMethods.bankAccount, 'docsBank');
//   }
//   if (doc.paymentMethods&&(doc.paymentMethods.fawry, 'fawryDocs')) {
//     editDocUrlPayment(doc.paymentMethods.fawry, 'fawryDocs');
//   }
//   if (doc.paymentMethods&&(doc.paymentMethods.vodafoneCash, 'vodafoneCashDocs')) {
//     editDocUrlPayment(doc.paymentMethods.vodafoneCash, 'vodafoneCashDocs');
//   }
// });
// charitySchema.pre('findOneAndUpdate', async function (next) {
//   // the update operation object is stored within this.getUpdate()
//   console.log('charitySchemaMiddleWare');
//   console.log(this.getUpdate());
//   // console.log( this.getUpdate().$set.password);
//   const passwordToUpdate = this.getUpdate().$set.password;

//   if (passwordToUpdate) {
//     const salt = await bcrypt.genSalt(
//       configurationProvider.getValue('hashing.salt')
//     );
//     this.getUpdate().$set.password = await bcrypt.hash(passwordToUpdate, salt);
//   }
// });
const Charity = mongoose.model('Charity', charitySchema);

export default Charity;
