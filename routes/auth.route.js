import { Router } from "express";
import { signup, login } from "../controllers/auth/auth.controller.js";
import { verifyEmail } from "../controllers/auth/verificationToken.controller.js";

const router = Router()

router.post('/signup', signup)
router.post('/login', login)
router.get('/verify-email/:token', verifyEmail)

export default router