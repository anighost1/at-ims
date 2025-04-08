import { Router } from "express";
import { create, update, find, getProducts, switchStatus } from "../../controllers/masterEntry/product.controller.js";
import { upload } from "../../config/multer.config.js";
const router = Router()

router.post('/', upload.array('doc'),create)
router.put('/', update)
router.get('/', getProducts)
router.get('/switch/:id', switchStatus)
router.get('/:id', find)

export default router