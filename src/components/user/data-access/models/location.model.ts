import mongoose, { InferSchemaType } from 'mongoose';

const locationSchema = new mongoose.Schema(
  {
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
      // required: true,
    },
    city: {
      type: String,
    },
    street: {
      type: String,
    },
  },
  { _id: false }
);

export type UserLocation = InferSchemaType<typeof locationSchema>;

export default locationSchema;
