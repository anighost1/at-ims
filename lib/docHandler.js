import Doc from "../models/doc.model.js"

export const createDoc = async (docsArray) => {
    if (!Array.isArray(docsArray) || docsArray.length === 0) {
        throw new Error('Invalid document data provided')
    }
    const newDocs = await Doc.createManyDocs(docsArray)

    return newDocs
}

export const getDoc = async (req, referenceNumber) => {

    if (!referenceNumber) {
        throw new Error('Reference number is required as "referenceNo"')
    }

    const docData = await Doc.getDoc(referenceNumber)
    if (!docData) {
        throw new Error('No document found')
    }

    return `${req.protocol}://${req.get('host')}/doc/${docData?.fileName}`;


}