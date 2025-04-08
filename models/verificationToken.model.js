import mongoose, { Schema } from "mongoose";
import User from "./user.model.js";
import crypto from "crypto";

const tokenSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600
    }, // Token expires in 1 hour
});


tokenSchema.statics.store = async function (userId) {
    const token = crypto.randomBytes(32).toString("hex");

    const verificationToken = new this({
        userId,
        token
    });

    await verificationToken.save();

    return verificationToken;
};

tokenSchema.statics.verify = async function (token) {
    const verificationToken = await this.findOne({ token });

    if (!verificationToken) {
        throw new Error('Invalid or expired token');
    }

    await User.updateOne({ _id: verificationToken.userId }, { isVerified: true });
    await this.deleteOne({ _id: verificationToken._id });

    return verificationToken;
};


const VerificationToken = mongoose.model("VerificationToken", tokenSchema);

export default VerificationToken;
