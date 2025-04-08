import mongoose, { Schema } from "mongoose";


const inventorySchema = new Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    storage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Storage',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    openingQuantity: {
        type: Number,
        required: true
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
inventorySchema.statics.createInventory = async function (product, storage, quantity) {

    const inventory = new this({
        product,
        storage,
        quantity,
        openingQuantity: quantity,
    });

    await inventory.save();

    return inventory;
};

//update
inventorySchema.statics.updateInventory = async function (id, product, storage, quantity) {
    const updateData = {
        ...(product && { product }),
        ...(storage && { storage }),
        ...(quantity && { quantity }),
    };

    const inventory = await this.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    });

    return inventory;
};

//find
inventorySchema.statics.findInventory = async function (id) {
    const inventory = await this.findById(id).populate('product').populate('storage');
    if (!inventory) {
        throw new Error('Inventory not found');
    }
    return inventory;
};

//switch status
inventorySchema.statics.switch = async function (id) {
    const inventory = await this.findOne({ _id: id });

    if (!inventory) {
        throw new Error('Inventory not found');
    }

    const newStatus = !inventory.status;

    const updatedInventory = await this.updateOne(
        { _id: id },
        { $set: { status: newStatus } }
    );

    return updatedInventory;
};


const Inventory = mongoose.model('Inventory', inventorySchema)

export default Inventory