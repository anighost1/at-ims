import { Router } from "express";
import { create, update, find, getUnits, switchStatus } from "../../controllers/masterEntry/unit.controller.js";
const router = Router()

router.post('/', create)
router.put('/', update)
router.get('/', getUnits)
router.get('/switch/:id', switchStatus)
router.get('/:id', find)

export default router