import mongoose from "mongoose";

const usedSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['clothes', 'electronics', 'appliances', 'furniture', 'others'],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: {
        type: [String], // Array of image URLs
        default:undefined,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
});

const Used = mongoose.model('Used', usedSchema);

export default Used;