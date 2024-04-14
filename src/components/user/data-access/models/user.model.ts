import mongoose, { Schema, InferSchemaType, HydratedDocument } from 'mongoose';
import bcrypt from 'bcryptjs';
import * as configurationProvider from '../../../../libraries/configuration-provider/index';
import locationSchema from './location.model';
const userSchema = new Schema(
  {
    // name: {
    //   type: {
    //     firstName: {
    //       type: String,
    //       required: true,
    //     },
    //     lastName: {
    //       type: String,
    //       required: true,
    //     },
    //   },
    //   required: true,
    // },

    // If you want the entire name object to be required, meaning both firstName and lastName must be provided,
    // you can use a custom validator.

    name: {
      firstName: {
        type: String,
        required: [true, 'First name is required'],
      },
      lastName: {
        type: String,
        required: [true, 'Last name is required'],
      },
    },

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
    locationUser: {
      type: locationSchema,
      // required: true, // 👁️👁️👁️👁️👁️👁️👁️👁️👁️👁️👁️👁️ locationUser shouldn't be required.
    },
    // profileImage: {
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
      // default: '',   LOOK HERE 👁️👁️👁️
    },
    // emailVerification: {
    //   required: true, // 👁️👁️
    //   isVerified: {
    //     type: Boolean,
    //     default: false,
    //   },
    //   verificationDate: {
    //     // type: Date,
    //     // default: null,
    //     type: String,
    //     default: '',
    //   },
    // },

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
    // Another way 👇👇
    // emailVerification: {
    //   // This will satisfy TypeScript’s strict null checks and prevent the error.
    //   default: () => ({}), // Set a default empty object for emailVerification
    //   type: {
    //     isVerified: {
    //       type: Boolean,
    //       default: false,
    //     },
    //     verificationDate: {
    //       type: String,
    //       default: '',
    //     },
    //   },
    // },

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
// export type User = InferSchemaType<typeof userSchema>;
export type User = HydratedDocument<InferSchemaType<typeof userSchema>>;
// InferSchemaType will determine the type as follows:
// type User = {
//   name: string;
//   email: string;
//   avatar?: string;
// }

// `UserModel` will have `name: string`, etc..
const UserModel = mongoose.model<User>('Users', userSchema);
export default UserModel;
