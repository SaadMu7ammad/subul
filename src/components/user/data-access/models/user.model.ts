import { IUser } from '@components/user/data-access/interfaces';
import * as configurationProvider from '@libs/configuration-provider/index';
import logger from '@utils/logger';
import bcrypt from 'bcryptjs';
import mongoose, { HydratedDocument, InferSchemaType, Schema } from 'mongoose';

import locationSchema from './location.model';

const userSchema = new Schema(
  {
    name: {
      type: {
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
          required: true,
        },
      },
      required: true,
    },
    //for both used Items and fundraising campaigns
    contributions: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    // If you want the entire name object to be required, meaning both firstName and lastName must be provided,
    // you can use a custom validator.

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    pointsOnDonations: {
      type: Number,
      default: 0,
    },
    totalDonationsAmount: {
      type: Number,
      default: 0,
    },
    totalDonationsCount: {
      type: Number,
      default: 0,
    },
    userLocation: {
      type: locationSchema,
      // required: true, // 👁️👁️👁️👁️👁️👁️👁️👁️👁️👁️👁️👁️ userLocation shouldn't be required.
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
      required: true,
    },
    phone: {
      type: String,
    },
    verificationCode: {
      type: String,
      default: null,
      // default: '',   LOOK HERE 👁️👁️👁️
    },

    // If you want to make the emailVerification object itself required, you’ll need to use a custom validator as well.
    emailVerification: {
      isVerified: {
        type: Boolean,
        default: false,
      },
      verificationDate: {
        type: String,
        default: '',
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
        // type: String,
        // default: '',
      },
    },
    isEnabled: {
      type: Boolean,
      default: true,
    },
    transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    //to not change password every time we edit the user data
    logger.warn('password not changed');
    return next();
  }
  const salt = await bcrypt.genSalt(configurationProvider.getValue('hashing.salt'));
  this.password = await bcrypt.hash(this.password, salt);
  logger.warn('password has been changed');
});

declare module '../interfaces/' {
  export type IUser = HydratedDocument<InferSchemaType<typeof userSchema>>;

  export type PlainUser = Omit<InferSchemaType<typeof userSchema>, 'createdAt' | 'updatedAt'>;
}

// `UserModel` will have `name: string`, etc..
const UserModel = mongoose.model<IUser>('Users', userSchema);
export default UserModel;
