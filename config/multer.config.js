import path from 'path'
import multer from 'multer';
import fs from 'fs';

const storagePath = 'public/doc'

const ensureDirectoryExists = (directoryPath) => {
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        ensureDirectoryExists(storagePath);
        cb(null, storagePath);
    },
    // filename: (req, file, cb) => {
    //     const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    //     req.unique = uniqueSuffix
    //     cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    // },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const finalFileName = `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`;

        if (!req.uploadedFiles) {
            req.uploadedFiles = [];
        }

        req.uploadedFiles.push({
            fileName: finalFileName,
            referenceNumber: uniqueSuffix,
            mimeType: file.mimetype
        });

        cb(null, finalFileName);
    },
});

export const upload = multer({ storage });