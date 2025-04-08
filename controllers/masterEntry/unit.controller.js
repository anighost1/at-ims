import Unit from "../../models/unit.model.js"
import generateResponse from "../../lib/generateResponse.js"
import HttpStatus from "../../lib/httpStatus.js"
import { paginate } from "../../lib/pagination.js"

export const create = async (req, res) => {
    const { name, abbreviation, description } = req.body
    try {
        const newCategory = await Unit.createUnit(name, abbreviation, description)
        generateResponse(
            res,
            HttpStatus.Created,
            'Unit successfully created',
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
    const { id, name, abbreviation, description } = req.body
    try {
        const newCategory = await Unit.updateUnit(id, name, abbreviation, description)
        generateResponse(
            res,
            HttpStatus.OK,
            'Unit updated successfully',
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
        const result = await Unit.findUnit(id)
        if (!result) {
            throw new Error('Unit not found')
        }
        generateResponse(
            res,
            HttpStatus.Found,
            'Unit found successfully',
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

export const getUnits = async (req, res) => {
    const page = Number(req?.query?.page) || 1;
    const take = Number(req?.query?.take) || 10;

    const search = req?.query?.q ? String(req?.query?.q) : undefined;
    const status = req?.query?.status === 'true' ? true : req?.query?.status === 'false' ? false : undefined;

    let whereClause = {};

    if (search) {
        whereClause.$or = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { abbreviation: { $regex: search, $options: "i" } }
        ];
    }

    if (typeof status === 'boolean') {
        whereClause.status = status;
    }

    try {
        const { result, pagination } = await paginate(Unit, whereClause, page, take);
        generateResponse(
            res,
            HttpStatus.Found,
            'Unit found successfully',
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
        const result = await Unit.switch(id)

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