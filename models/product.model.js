import mongoose, { Schema } from "mongoose";


const productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    productCode: {
        type: String,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    unit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Unit',
        required: true
    },
    status: {
        type: Boolean,
        default: true,
    },
    doc: {
        type: [String],
        default: []
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
productSchema.statics.createProduct = async function (name, category, unit, description, productCode, doc) {

    const product = new this({
        name,
        category,
        unit,
        ...description && { description },
        ...productCode && { productCode },
        ...doc && { doc },
    });

    await product.save();

    return product;
};

//update
productSchema.statics.updateProduct = async function (id, name, category, unit, description, productCode) {
    const updateData = {
        ...(name && { name }),
        ...(category && { category }),
        ...(unit && { unit }),
        ...(description && { description }),
        ...productCode && { productCode },
    };

    const product = await this.findByIdAndUpdate(id, updateData, {
        new: true, // return the updated document
        runValidators: true, // validate before updating
    });

    return product;
};

//find
productSchema.statics.findProduct = async function (id) {
    const product = await this.findById(id).populate('category').populate('unit');
    if (!product) {
        throw new Error('Product not found');
    }
    return product;
};

//switch status
productSchema.statics.switch = async function (id) {
    const product = await this.findOne({ _id: id });

    if (!product) {
        throw new Error('Product not found');
    }

    const newStatus = !product.status;

    const updatedProduct = await this.updateOne(
        { _id: id },
        { $set: { status: newStatus } }
    );

    return updatedProduct;
};


const Product = mongoose.model('Product', productSchema)

export default Product