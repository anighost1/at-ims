/* eslint-disable no-undef */
import User from "../../models/user.model.js"
import VerificationToken from "../../models/verificationToken.model.js"
import generateResponse from "../../lib/generateResponse.js"
import HttpStatus from "../../lib/httpStatus.js"
import sendEmail from "../../config/mailjet.config.js"

export const signup = async (req, res) => {
    const { name, username, email, password } = req.body
    try {
        const newUser = await User.signup(name, username, email, password)
        const verificationToken = await VerificationToken.store(newUser._id)
        const emailResponse = await sendEmail(
            process.env.MJ_SENDER_EMAIL,
            process.env.MJ_SENDER_NAME,
            email,
            name,
            'Verify your email address',
            `Click the link below to verify your email address: ${req.protocol}://${req.get('host')}/api/auth/verify-email/${verificationToken?.token}`,
        )
        console.log(emailResponse)
        generateResponse(
            res,
            HttpStatus.OK,
            'User successfully created',
            newUser
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

export const login = async (req, res) => {
    const { identifier, password } = req.body
    try {
        const token = await User.login(identifier, password)
        generateResponse(
            res,
            HttpStatus.OK,
            'User logged in successfully',
            token
        )
    } catch (err) {
        console.error(`[${new Date().toISOString()}]`, err)
        generateResponse(
            res,
            err?.status || HttpStatus.Unauthorized,
            err?.message
        )
    }
}
