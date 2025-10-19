import express from 'express';
import multer from 'multer';
import { Readable } from 'stream';
import cloudinary from '../config/cloudinary.js';
import { verifyToken } from '../middleware/verifyToken.js';

const postmediarouter = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

postmediarouter.post('/upload-media', verifyToken, upload.array('files', 5), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: 'No media files uploaded.' });
        }

        const uploads = await Promise.all(
            req.files.map((file) => {
                const ext = file.originalname.split('.').pop().toLowerCase();
                const videoExtensions = ['mp4', 'mov', 'avi', 'wmv', 'flv', 'mkv', 'webm', 'mpeg', 'mpg', 'm4v', '3gp'];

                const resourceType = file.mimetype.startsWith('video') || videoExtensions.includes(ext)
                    ? 'video'
                    : 'image';

                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        {
                            resource_type: resourceType,
                            folder: 'trekmate_post_media',
                        },
                        (error, result) => {
                            if (result) resolve({
                                url: result.secure_url,
                                public_id: result.public_id,
                                resource_type: result.resource_type
                            });
                            else reject(error);
                        }
                    );

                    Readable.from(file.buffer).pipe(stream);
                });
            })
        );

        return res.status(200).json({
            success: true,
            message: 'Files uploaded successfully.',
            media: uploads,
        });
    } catch (error) {
        console.error('Post Media Upload Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error while uploading media.',
            error: error.message,
        });
    }
});

// Multer error handler for too many files
postmediarouter.use((err, req, res, next) => {
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
            success: false,
            message: 'You can upload a maximum of 5 files at a time.',
        });
    }
    next(err);
});
export default postmediarouter;
