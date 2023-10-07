import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv/config';

const locationSchema = new mongoose.Schema({
    governorate: {
        type: String,
        required: false,
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

const userSchema = new mongoose.Schema(
    {
        name: {
            firstName: {
                type: String,
                required: true,
            },
            lastName: {
                type: String,
                required: true,
            },
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        isAdmin: {
            type: Boolean,
            default: false,
            required: true,
        },
        points: {
            type: Number,
            default: 0,
        },
        location: locationSchema,
        // profileImage: {
        //     type: String,
        //     required: false,
        // },
        gender: {
            type: String,
            required: false,
        },
        phone: [
            {
                type: Number,
                required: true,
            },
        ],
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
        isEnabled :{
            type: Boolean,
            default: true,
            required: true,
        },
        transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
    },
    { timestamps: true }
);
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        //to not change password every time we edit the user data
        next();
    }
    const salt = await bcrypt.genSalt(+process.env.SALT);
    this.password = await bcrypt.hash(this.password, salt);
});



userSchema.methods.comparePassword = async function (enteredPassword) {
    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    return isMatch;
};

const User = mongoose.model('Users', userSchema);
export { User };
