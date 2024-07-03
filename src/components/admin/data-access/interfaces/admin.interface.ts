import mongoose from 'mongoose';

export type QueryObject = {
  $and: {
    isPending?: boolean;
    isEnabled?: boolean;
    isConfirmed?: boolean;
    $or?: { [key: string]: boolean }[];
    _id?: mongoose.Types.ObjectId | string;
  }[];
};
