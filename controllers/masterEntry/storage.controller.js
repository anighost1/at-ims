import Storage from "../../models/storage.model.js"
import generateResponse from "../../lib/generateResponse.js"
import HttpStatus from "../../lib/httpStatus.js"
import { paginate } from "../../lib/pagination.js"

export const create = async (req, res) => {
    const { name, isRefrigerated, description } = req.body
    try {
        const newCategory = await Storage.createStorage(name, isRefrigerated, description)
        generateResponse(
            res,
            HttpStatus.Created,
            'Storage successfully created',
            newCategory
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
    const { id, name, isRefrigerated, description } = req.body
    try {
        const newCategory = await Storage.updateStorage(id, name, isRefrigerated, description)
        generateResponse(
            res,
            HttpStatus.OK,
            'Storage updated successfully',
            newCategory
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
        const result = await Storage.findStorage(id)
        if (!result) {
            throw new Error('Storage not found')
        }
        generateResponse(
            res,
            HttpStatus.Found,
            'Storage found successfully',
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

export const getStorage = async (req, res) => {
    const page = Number(req?.query?.page) || 1;
    const take = Number(req?.query?.take) || 10;

    const search = req?.query?.q ? String(req?.query?.q) : undefined;
    const status = req?.query?.status === 'true' ? true : req?.query?.status === 'false' ? false : undefined;
    const refrigerated = req?.query?.refrigerated === 'true' ? true : req?.query?.refrigerated === 'false' ? false : undefined;

    let whereClause = {};

    if (search) {
        whereClause.$or = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } }
        ];
    }

    if (typeof status === 'boolean') {
        whereClause.status = status;
    }

    if (typeof refrigerated === 'boolean') {
        whereClause.refrigerated = refrigerated;
    }

    try {
        const { result, pagination } = await paginate(Storage, whereClause, page, take);
        generateResponse(
            res,
            HttpStatus.Found,
            'Storage found successfully',
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
        const result = await Storage.switch(id)

        generateResponse(
            res,
            HttpStatus.OK,
            'Status Changed successfully',
            result
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