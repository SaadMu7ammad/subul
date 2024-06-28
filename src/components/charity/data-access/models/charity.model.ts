import { ICharity } from '@components/charity/data-access/interfaces';
import * as configurationProvider from '@libs/configuration-provider/index';
import bcrypt from 'bcryptjs';
import mongoose, { HydratedDocument, InferSchemaType, Schema } from 'mongoose';

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
      _id: mongoose.Types.ObjectId,
      enable: {
        //account is valid to use or not (freezed or in reviewing)
        type: Boolean,
        default: false,
      },
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
      bankDocs: {
        type: [String], // Define it as an array of strings
        required: true,
      },
    },
  ],
  fawry: [
    {
      _id: mongoose.Types.ObjectId,
      enable: {
        type: Boolean,
        default: false,
      },
      number: {
        type: String,
        required: true,
      },

      fawryDocs: {
        type: [String],
        required: true,
      },
    },
  ],
  vodafoneCash: [
    {
      _id: mongoose.Types.ObjectId,
      enable: {
        type: Boolean,
        default: false,
      },
      number: {
        type: String,
        required: true,
      },

      vodafoneCashDocs: {
        type: [String],
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
    image: {
      type: String,
      required: true, // Ensure it's required
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
    name: {
      type: String,
      required: true,
    },
    contactInfo: {
      type: {
        email: {
          type: String,
          required: true,
        },
        phone: {
          type: String,
          required: true,
        },
        websiteUrl: {
          type: String,
          required: true,
        },
      },
      required: true,
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
      default: '',
    },
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
        type: String,
        default: '',
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
    paymentMethods: {
      type: paymentMethodSchema,
      required: false,
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
    charityLocation: {
      type: [locationSchema],
      default: undefined,
      required: [true, 'At least one location is required.'],
    },
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
  },
  { timestamps: true }
);

charitySchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    //to not change password every time we edit the user data
    next();
  }
  const salt = await bcrypt.genSalt(configurationProvider.getValue('hashing.salt'));
  this.password = await bcrypt.hash(this.password, salt);
});

declare module '../interfaces/charity.interface' {
  export type ICharity = HydratedDocument<InferSchemaType<typeof charitySchema>>;
  export type PlainCharity = Exclude<
    InferSchemaType<typeof charitySchema>,
    'createdAt' | 'updatedAt'
  >;
  export type IPaymentMethods = HydratedDocument<InferSchemaType<typeof paymentMethodSchema>>;
}

export const Charity = mongoose.model<ICharity>('Charity', charitySchema);

export default Charity;
