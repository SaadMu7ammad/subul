import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
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
            accNumber: {
                type: String,
                required: true,
            },
            iban: {
                type: String,
                required: true,
            },
            swiftCode: {
                type: String,
                required: true,
            },
        },
    ],
    fawry: [
        {
            number: {
                type: String,
                required: true,
            },
        },
    ],
    vodafoneCash: [
        {
            number: {
                type: String,
                required: true,
            },
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
        // logoImg: {},
        // profileImg: {},
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
        paymentMethods: {
            type: paymentMethodSchema,
            required: true,
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
    },
    { timestamps: true }
);

charitySchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        //to not change password every time we edit the user data
        next();
    }
    const salt = await bcrypt.genSalt(+process.env.SALT);
    this.password = await bcrypt.hash(this.password, salt);
});

charitySchema.methods.comparePassword = async function (enteredPassword) {
    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    return isMatch;
};

const Charity = mongoose.model('Charity', charitySchema);

export default Charity;
