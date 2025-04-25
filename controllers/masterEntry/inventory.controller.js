import Inventory from "../../models/inventory.model.js"
import generateResponse from "../../lib/generateResponse.js"
import HttpStatus from "../../lib/httpStatus.js"
import { paginate } from "../../lib/pagination.js"

export const create = async (req, res) => {
    const { product, storage, quantity } = req.body
    try {
        const newInventory = await Inventory.createInventory(product, storage, Number(quantity))
        generateResponse(
            res,
            HttpStatus.Created,
            'Inventory successfully created',
            newInventory
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
    const { id, product, storage, quantity } = req.body
    try {
        const newInventory = await Inventory.updateInventory(id, product, storage, Number(quantity))
        generateResponse(
            res,
            HttpStatus.OK,
            'Inventory updated successfully',
            newInventory
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
        const category = await Inventory.findInventory(id)
        if (!category) {
            throw new Error('Inventory not found')
        }
        generateResponse(
            res,
            HttpStatus.OK,
            'Inventory found successfully',
            category
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

export const getInventories = async (req, res) => {
    const page = Number(req?.query?.page) || 1;
    const take = Number(req?.query?.take) || 10;

    const status = req?.query?.status === 'true' ? true : req?.query?.status === 'false' ? false : undefined;
    const product = req?.query?.product ? String(req?.query?.product) : undefined;
    const storage = req?.query?.storage ? String(req?.query?.storage) : undefined;

    let whereClause = {};

    if (product) {
        whereClause.product = product;
    }

    if (storage) {
        whereClause.storage = storage;
    }

    if (typeof status === 'boolean') {
        whereClause.status = status;
    }

    try {
        const { result, pagination } = await paginate(Inventory, whereClause, page, take);
        generateResponse(
            res,
            HttpStatus.OK,
            'Inventory found successfully',
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
        const category = await Inventory.switch(id)

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