import mongoose, { Schema } from "mongoose";


const docSchema = new Schema({
    referenceNumber: {
        type: String,
        required: true,
        unique: true
    },
    mimeType: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: v => v.toLocaleDateString(),
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        get: v => v.toLocaleDateString(),
    },
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
});


docSchema.statics.createDoc = async function (referenceNumber, mimeType, fileName) {
    const doc = new this({
        referenceNumber,
        mimeType,
        fileName,
    });
    await doc.save();
    return doc;
};

docSchema.statics.createManyDocs = async function (docsArray) {
    const insertedDocs = await this.insertMany(docsArray);
    return insertedDocs;
};

docSchema.statics.getDoc = async function (referenceNumber) {
    const docData = await this.findOne({ referenceNumber: referenceNumber })
    return docData;
};

const Doc = mongoose.model('Doc', docSchema)

export default Doc