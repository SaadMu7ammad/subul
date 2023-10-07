import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const locationSchema = new mongoose.Schema({
    governorate: {
        type: String,
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
            accNumber: String,
            iban: String,
            swiftCode: String,
        },
    ],
    fawry: [
        {
            number: String,
        },
    ],
    vodafoneCash: [
        {
            number: String,
        },
    ],
});

const charitySchema = new Schema(
    {
        cases: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Case',
            },
        ],
        logoImg: {},
        profileImg: {},
        email: {
            type: String,
            required: true,
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
        totalDonations: {
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
        isEnabled: {
            type: Boolean,
            default: true,
            required: true,
        },
        paymentMethods: paymentMethodSchema,
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
        location: [locationSchema],
        files: [{}],
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
    },
    { timestamps: true }
);

const Charity = mongoose.model('Charity', charitySchema);

export default Charity;
