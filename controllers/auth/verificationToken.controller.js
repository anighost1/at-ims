import generateResponse from "../../lib/generateResponse.js"
import HttpStatus from "../../lib/httpStatus.js"
import VerificationToken from "../../models/verificationToken.model.js"

export const verifyEmail = async (req, res) => {
    const { token } = req.params
    try {
        const newUser = token
        const verification = await VerificationToken.verify(token);

        if (!verification) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        generateResponse(
            res,
            HttpStatus.OK,
            'Email successfully verified',
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
