import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv/config';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
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
