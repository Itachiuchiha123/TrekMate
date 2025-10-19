// middleware/upload.js
import multer from 'multer';

const storage = multer.memoryStorage(); // buffer-based
const upload = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // Max 100MB (adjust as needed)
});

export default upload;
