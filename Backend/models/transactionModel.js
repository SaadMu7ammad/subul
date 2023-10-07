import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const paymentMethodSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    bankAccount: {
        accNumber: String,
        iban: String,
        swiftCode: String,
    },
    fawry: {
        number: String,
    },
    vodafoneCash: {
        number: String,
    },
});

const transactionSchema = new Schema(
    {
        case: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Case',
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        moneyPaid: {
            type: Number,
            required: true,
        },
        paymentMethod: paymentMethodSchema,
    },
    { timestamps: true }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
