import Category from "../../models/category.model.js"
import generateResponse from "../../lib/generateResponse.js"
import HttpStatus from "../../lib/httpStatus.js"
import { paginate } from "../../lib/pagination.js"

export const create = async (req, res) => {
    const { name, description } = req.body
    try {
        const newCategory = await Category.createCategory(name, description)
        generateResponse(
            res,
            HttpStatus.Created,
            'Category successfully created',
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
    const { id, name, description } = req.body
    try {
        const newCategory = await Category.updateCategory(id, name, description)
        generateResponse(
            res,
            HttpStatus.OK,
            'Category updated successfully',
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
        const category = await Category.findCategory(id)
        if (!category) {
            throw new Error('Category not found')
        }
        generateResponse(
            res,
            HttpStatus.OK,
            'Category found successfully',
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

export const getCategories = async (req, res) => {
    const page = Number(req?.query?.page) || 1;
    const take = Number(req?.query?.take) || 10;

    const search = req?.query?.q ? String(req?.query?.q) : undefined;
    const status = req?.query?.status === 'true' ? true : req?.query?.status === 'false' ? false : undefined;

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

    try {
        const { result, pagination } = await paginate(Category, whereClause, page, take);
        generateResponse(
            res,
            HttpStatus.OK,
            'Category found successfully',
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
        const category = await Category.switch(id)

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