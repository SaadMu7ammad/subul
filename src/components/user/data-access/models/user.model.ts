// import mongoose, { Schema } from 'mongoose';
import mongoose, { Schema, InferSchemaType } from 'mongoose';
import bcrypt from 'bcryptjs';
import * as configurationProvider from '../../../../libraries/configuration-provider/index';
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
    },
    pointsOnDonations: {
      type: Number,
      default: 0,
    },
    totalDonationsAmount: {
      type: Number,
      default: 0,
    },
    locationUser: {
      type: locationSchema, // Use locationSchema here
      // required: true, // 👁️👁️👁️👁️👁️👁️👁️👁️👁️👁️👁️👁️ locationUser shouldn't be required.
    }, // profileImage: {
    //     type: String,
    //
    // },
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
      // default: '',
    },
    emailVerification: {
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
    transactions: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' },
    ],
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    //to not change password every time we edit the user data
    console.log('password not change');
    return next();
  }
  const salt = await bcrypt.genSalt(
    configurationProvider.getValue('hashing.salt')
  );
  this.password = await bcrypt.hash(this.password, salt);
  console.log('password has been changed');
});
// userSchema.pre('findOneAndUpdate', async function (next) {
//     // the update operation object is stored within this.getUpdate()
//     console.log('userSchemaMiddleWare')
//     console.log(this.getUpdate())
//     // console.log( this.getUpdate().$set.password);
//     const passwordToUpdate = this.getUpdate().$set.password;

//     if (passwordToUpdate) {
//       const salt = await bcrypt.genSalt(configurationProvider.getValue('hashing.salt'));
//       this.getUpdate().$set.password = await bcrypt.hash(passwordToUpdate, salt);
//     }

// });
export type User = InferSchemaType<typeof userSchema>;

// `UserModel` will have `name: string`, etc..
const UserModel = mongoose.model('Users', userSchema);
export default UserModel;
