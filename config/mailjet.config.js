/* eslint-disable no-undef */
import Mailjet from "node-mailjet"


const sendEmail = async (senderEmail, senderName, recipientEmail, recipientName, subject, textPart, htmlPart) => {
    const mailjet = Mailjet.apiConnect(
        process.env.MJ_APIKEY,
        process.env.MJ_SECRET
    )

    const request = await mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [
            {
                From: {
                    Email: senderEmail,
                    Name: senderName,
                },
                To: [
                    {
                        Email: recipientEmail,
                        Name: recipientName,
                    },
                ],
                Subject: subject,
                TextPart: textPart,
                HTMLPart: htmlPart,
            },
        ],
    })

    return request?.body

}

export default sendEmail