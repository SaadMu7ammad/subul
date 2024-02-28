import mongoose from 'mongoose';
import locationSchema  from './location.model.js';

const caseSchema = new mongoose.Schema(
    {
        charity: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Charity',
        },
        title: {
            type: String,
            required: [true, 'title must be provided'],
        },
        description: {
            type: String,
            required: [true, 'description must be provided'],
        },
        mainType: {
            type: String,
            enum: [
                'Sadaqa',
                'Zakah',
                'BloodDonation',
                'kafarat',
                'Adahi',
                'Campains',
                'UsedProperties',
            ],
            required: [true, 'maintype for that case must be provided'],
        },
        coverImage: {
            type: String,
            required: [true, 'coverImage for that case must be provided'],
        },
        location: { type: [locationSchema],default:undefined, required: [true,'At least one location is required.']},
        subType: {
            type: String,
            required: [true, 'subType for that case must be provided'],
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
        // status: {
        //   //still open or not
        //   type: Boolean,
        //   required: false,
        //   default: true,
        // },
        dateFinished: {
            type: Date,
            required: false,
        },
        donationNumbers: {
            type: Number,
            required: false,
            default: 0,
        },
        // number of beneficiaries
        helpedNumbers: {
            type: Number,
            required: [true, 'helpedNumbers must be provided'],
        },
        freezed: {
            //for admin decisions
            type: Boolean,
            required: false,
            default: false,
        },
        targetDonationAmount: {
            type: Number,
            required: [true, 'targetDonationAmount must be provided'],
        },
        currentDonationAmount: {
            type: Number,
            required: false,
            default: 0,
        },
        //last time donated from timestamps
    },
    { timestamps: true }
);
// caseSchema.virtual('charityName.name').get(function () {
//   return this.charityName ? this.charityName.name : '';
// });

const Case = mongoose.model('Cases', caseSchema);
export default Case;
