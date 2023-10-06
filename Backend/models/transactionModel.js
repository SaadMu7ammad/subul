import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    case:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Case'
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    moneyPaid:{
        type:Number,
        required:true
    },
    paymentMethod:{
        type:String,
        required:true
    },
    
},{ timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
