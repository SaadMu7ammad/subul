import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
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
});
const caseSchema = new mongoose.Schema(
  {
    chariyName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Charity',
    },
    title: {
      type: String,
      required: [true, 'title must provided'],
    },
    description: {
      type: String,
      required: [true, 'description must provided'],
    },
    Maintype: {
      type: String,
      required: [true, 'Maintype for that case must provided'],
      enum: [
        'Sadaqa',
        'Zakah',
        'BloodDonation',
        'kafarat',
        'Adahi',
        'Campains',
        'UsedProperties',
      ],
    },
    imageCover: {
      type: String,
      required: [true, 'imageCover for that case must provided'],
    },
    location: [{ type: locationSchema, required: true }],
    subType: {
      type: String,
      required: [true, 'subType for that case must provided'],
      enum: [
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
      ],
    },
    nestedSubType: {
      type: String,
      required: false,
      enum: [
        'Wasla',
        'Hafr Beer',
        'Burns',
        'Operations & AssistiveDevices',
        'Mini Projects',
        'General Support',
      ],
    },
    gender: {
      type: String,
      required: false,
      enum: ['male', 'female', 'none'],
      //   default: null,
    },
    finished: {
      type: Boolean,
      required: false,
      default: false,
    },
    upVotes: {
      type: Number,
      required: false,
      default: 0,
    },
    views: {
      type: Number,
      required: false,
      default: 0,
    },
    status: {
      //still open or not
      type: Boolean,
      required: false,
      default: true,
    },
    dateFinished: {
      type: Date,
      required: false,
    },
    dontationNumbers: {
      type: Number,
      required: false,
      default: 0,
    },
    // number of beneficiaries
    helpedNumbers: {
      type: Number,
      required: [true, 'must helpedNumbers provided'],
      //   default: 0,
    },
    freezed: {
      //for admin decisions
      type: Boolean,
      required: false,
      default: false,
    },
    targetDonationAmount: {
      type: Number,
      required: [true, 'must targetDonationAmount provided'],
    },
    currentDonationAmount: {
      type: Number,
      required: [true, 'must currentDonationAmount provided'],
    },
    //last time donated from timestamps
  },
  { timestamps: true }
);
// caseSchema.virtual('charityName.name').get(function () {
//   return this.charityName ? this.charityName.name : '';
// });

const Case = mongoose.model('Cases', caseSchema);
export { Case };
