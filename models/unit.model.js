import mongoose, { Schema } from "mongoose";


const unitSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    abbreviation: {
        type: String,
        required: true,
        unique: true,
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
unitSchema.statics.createUnit = async function (name, abbreviation, description) {

    const unit = new this({
        name,
        abbreviation,
        ...description && { description },
    });

    await unit.save();

    return unit;
};

//update
unitSchema.statics.updateUnit = async function (id, name, abbreviation, description) {
    const updateData = {
        ...(name && { name }),
        ...(abbreviation && { abbreviation }),
        ...(description && { description }),
    };

    const unit = await this.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    });

    return unit;
};

//find
unitSchema.statics.findUnit = async function (id) {
    const unit = await this.findById(id);
    if (!unit) {
        throw new Error('Unit not found');
    }
    return unit;
};

//switch status
unitSchema.statics.switch = async function (id) {
    const unit = await this.findOne({ _id: id });

    if (!unit) {
        throw new Error('Unit not found');
    }

    const newStatus = !unit.status;

    const updatedUnit = await this.updateOne(
        { _id: id },
        { $set: { status: newStatus } }
    );

    return updatedUnit;
};


const Unit = mongoose.model('Unit', unitSchema)

export default Unit