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
paymentMethodSchema.path('bankAccount').validate(function (value) {
  return value.length > 0;
}, 'At least one bank account must be provided.');

paymentMethodSchema.path('fawry').validate(function (value) {
  return value.length > 0;
}, 'At least one fawry account must be provided.');

paymentMethodSchema.path('vodafoneCash').validate(function (value) {
  return value.length > 0;
}, 'At least one vodafoneCash account must be provided.');

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
const editImgUrl = (doc) => {
  if (doc.image) {
    const urlImg = `http://${process.env.HOST}:${process.env.PORT}/LogoCharities/${doc.image}`;
    doc.image = urlImg;
  }
};
charitySchema.post('init', (doc) => {
  //after initialized the doc in db
  editImgUrl(doc);
});
charitySchema.post('save', (doc) => {
  //after save the doc in db
  editImgUrl(doc);
});
charitySchema.methods.comparePassword = async function (enteredPassword) {
  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  return isMatch;
};

const Charity = mongoose.model('Charity', charitySchema);

export default Charity;
