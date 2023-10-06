import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv/config';

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
    pointsOnDonations: {
      type: Number,
      default: 0,
      required: true,
    },
    totalDonationsAmount: {
      type: Number,
      default: 0,
      required: false,
    },
    location:{ locationSchema},
    // profileImage: {
    //     type: String,
    //     required: false,
    // },
    gender: {
      type: String,
      enum: ['male', 'female'],
      required: true,
    },
    phone: {
      type: String,
      required: true,
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
    phoneVerification: {
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
    transactions: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' },
    ],
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
