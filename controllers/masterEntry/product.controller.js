import Product from "../../models/product.model.js"
import generateResponse from "../../lib/generateResponse.js"
import HttpStatus from "../../lib/httpStatus.js"
import { paginate } from "../../lib/pagination.js"
import { createDoc, getDoc } from "../../lib/docHandler.js"

export const create = async (req, res) => {
    const { name, category, unit, description, productCode } = req.body
    const files = req.uploadedFiles || []
    try {
        const uploadedDoc = await createDoc(files)
        const referenceNoArray = uploadedDoc.map((doc) => doc?.referenceNumber)
        const newProduct = await Product.createProduct(name, category, unit, description, productCode, referenceNoArray)
        generateResponse(
            res,
            HttpStatus.Created,
            'Product successfully created',
            newProduct
        )
    } catch (err) {
        console.error(`[${new Date().toISOString()}]`, err)
        generateResponse(
            res,
            err?.status || HttpStatus.BadRequest,
            err?.message
        )
    }
}

export const update = async (req, res) => {
    const { id, category, unit, description, productCode } = req.body
    try {
        const newProduct = await Product.updateProduct(id, name, category, unit, description, productCode)
        generateResponse(
            res,
            HttpStatus.OK,
            'Product updated successfully',
            newProduct
        )
    } catch (err) {
        console.error(`[${new Date().toISOString()}]`, err)
        generateResponse(
            res,
            err?.status || HttpStatus.BadRequest,
            err?.message
        )
    }
}

export const find = async (req, res) => {
    const { id } = req.params
    try {
        const result = await Product.findProduct(id)
        if (result?.doc?.length > 0) {
            const docData = await Promise.all(result?.doc?.map(async (docRef) => {
                return await getDoc(req, docRef)
            }))
            result.doc = docData
        }
        if (!result) {
            throw new Error('Product not found')
        }
        generateResponse(
            res,
            HttpStatus.OK,
            'Product found successfully',
            result
        )
    } catch (err) {
        console.error(`[${new Date().toISOString()}]`, err)
        generateResponse(
            res,
            err?.status || HttpStatus.NotFound,
            err?.message
        )
    }
}

export const getProducts = async (req, res) => {
    const page = Number(req?.query?.page) || 1;
    const take = Number(req?.query?.take) || 10;

    const search = req?.query?.q ? String(req?.query?.q) : undefined;
    const status = req?.query?.status === 'true' ? true : req?.query?.status === 'false' ? false : undefined;
    const category = req?.query?.category ? String(req?.query?.category) : undefined;
    const unit = req?.query?.unit ? String(req?.query?.unit) : undefined;

    let whereClause = {};

    if (search) {
        whereClause.$or = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { productCode: { $regex: search, $options: "i" } }
        ];
    }

    if (category) {
        whereClause.category = category;
    }

    if (unit) {
        whereClause.unit = unit;
    }

    if (typeof status === 'boolean') {
        whereClause.status = status;
    }

    try {
        const { result, pagination } = await paginate(Product, whereClause, page, take);
        generateResponse(
            res,
            HttpStatus.OK,
            'Product found successfully',
            result,
            { pagination }
        )
    } catch (err) {
        console.error(`[${new Date().toISOString()}]`, err)
        generateResponse(
            res,
            err?.status || HttpStatus.NotFound,
            err?.message
        )
    }
}

export const switchStatus = async (req, res) => {
    const { id } = req.params
    try {
        const category = await Product.switch(id)

        generateResponse(
            res,
            HttpStatus.OK,
            'Status Changed successfully',
            category
        )
    } catch (err) {
        console.error(`[${new Date().toISOString()}]`, err)
        generateResponse(
            res,
            err?.status || HttpStatus.NotImplemented,
            err?.message
        )
    }
}