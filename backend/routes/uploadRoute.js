// routes/uploadRoute.js
import express from 'express';
import upload from '../middleware/upload.js';
import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';
import { verifyToken } from '../middleware/verifyToken.js';

const uploadrouter = express.Router();

uploadrouter.post('/upload', verifyToken, upload.single('file'), async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No file uploaded' });
        }
        if (req.query.type === "avatar") {
            if (!file.mimetype.startsWith("image/")) {
                return res.status(400).json({ msg: "Only images allowed for avatars" });
            }
        }
        const { mimetype, originalname } = req.file;
        const ext = originalname.split('.').pop().toLowerCase();



        const videoExtensions = ['mp4', 'mov', 'avi', 'wmv', 'flv', 'mkv', 'webm', 'mpeg', 'mpg', 'm4v', '3gp'];

        const resourceType =
            mimetype.startsWith('video') || videoExtensions.includes(ext)
                ? 'video'
                : 'image';

        console.log(mimetype, ext, resourceType);
        const streamUpload = () =>
            new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: resourceType,
                        folder: 'trekmate_uploads',
                    },
                    (error, result) => {
                        if (result) resolve(result);
                        else reject(error);
                    }
                );

                Readable.from(req.file.buffer).pipe(stream);
            });

        const result = await streamUpload();

        res.status(200).json({
            success: true,
            url: result.secure_url,
            public_id: result.public_id,
            resource_type: result.resource_type,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

export default uploadrouter;
