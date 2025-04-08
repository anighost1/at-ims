import mongoose, { Schema } from "mongoose";


const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
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
categorySchema.statics.createCategory = async function (name, description) {

    const category = new this({
        name,
        ...description && { description },
    });

    await category.save();

    return category;
};

//update
categorySchema.statics.updateCategory = async function (id, name, description) {
    const updateData = {
        ...(name && { name }),
        ...(description && { description }),
    };

    const category = await this.findByIdAndUpdate(id, updateData, {
        new: true, // return the updated document
        runValidators: true, // validate before updating
    });

    return category;
};

//find
categorySchema.statics.findCategory = async function (id) {
    const category = await this.findById(id);
    if (!category) {
        throw new Error('Category not found');
    }
    return category;
};

//switch status
categorySchema.statics.switch = async function (id) {
    const category = await this.findOne({ _id: id });

    if (!category) {
        throw new Error('Category not found');
    }

    const newStatus = !category.status;

    const updatedCategory = await this.updateOne(
        { _id: id },
        { $set: { status: newStatus } }
    );

    return updatedCategory;
};


const Category = mongoose.model('Category', categorySchema)

export default Category