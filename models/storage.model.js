import mongoose, { Schema } from "mongoose";


const storageSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    isRefrigerated: {
        type: Boolean,
        default: false,
    },
    description: {
        type: String,
    },
    status: {
        type: Boolean,
        default: true,
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

//create
storageSchema.statics.createStorage = async function (name, isRefrigerated, description) {

    const storage = new this({
        name,
        ...isRefrigerated && { isRefrigerated },
        ...description && { description },
    });

    await storage.save();

    return storage;
};

//update
storageSchema.statics.updateStorage = async function (id, name, isRefrigerated, description) {
    const updateData = {
        ...(name && { name }),
        ...(isRefrigerated && { isRefrigerated }),
        ...(description && { description }),
    };

    const storage = await this.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    });

    return storage;
};

//find
storageSchema.statics.findStorage = async function (id) {
    const storage = await this.findById(id);
    if (!storage) {
        throw new Error('Storage not found');
    }
    return storage;
};

//switch status
storageSchema.statics.switch = async function (id) {
    const storage = await this.findOne({ _id: id });

    if (!storage) {
        throw new Error('Storage not found');
    }

    const newStatus = !storage.status;

    const updatedStorage = await this.updateOne(
        { _id: id },
        { $set: { status: newStatus } }
    );

    return updatedStorage;
};


const Storage = mongoose.model('Storage', storageSchema)

export default Storage