import { Router } from "express";
import { create, update, find, getInventories, switchStatus } from "../../controllers/masterEntry/inventory.controller.js";
const router = Router()

router.post('/', create)
router.put('/', update)
router.get('/', getInventories)
router.get('/switch/:id', switchStatus)
router.get('/:id', find)

export default router