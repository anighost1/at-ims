import { Router } from "express";
import { create, update, find, getCategories, switchStatus } from "../../controllers/masterEntry/category.controller.js";
const router = Router()

router.post('/', create)
router.put('/', update)
router.get('/', getCategories)
router.get('/switch/:id', switchStatus)
router.get('/:id', find)

export default router