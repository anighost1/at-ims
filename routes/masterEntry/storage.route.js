import { Router } from "express";
import { create, update, find, getStorage, switchStatus } from "../../controllers/masterEntry/storage.controller.js";
const router = Router()

router.post('/', create)
router.put('/', update)
router.get('/', getStorage)
router.get('/switch/:id', switchStatus)
router.get('/:id', find)

export default router