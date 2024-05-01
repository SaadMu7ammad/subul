import mongoose, { HydratedDocument, InferSchemaType } from 'mongoose';

const usedItemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['clothes', 'electronics', 'appliances', 'furniture', 'others'],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: {
    type: [String], // Array of image URLs
    default: undefined,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  booked: {
    type: Boolean,
    default: false,
  },
});

const UsedItem = mongoose.model('UsedItem', usedItemSchema);

declare module '../interfaces' {
  export type IUsedItem = HydratedDocument<
    InferSchemaType<typeof usedItemSchema>
  >;

  export type PlainIUsedItem = InferSchemaType<typeof usedItemSchema>;
}

export default UsedItem;
