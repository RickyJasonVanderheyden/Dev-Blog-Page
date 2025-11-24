import { Request, Response } from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary';
import { Readable } from 'stream';

// Configure multer for memory storage (no local files)
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only allow images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

const uploadToCloudinary = (buffer: Buffer, folder: string = 'blog-images'): Promise<any> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'auto',
        quality: 'auto',
        fetch_format: 'auto',
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    // Convert buffer to stream and pipe to Cloudinary
    const bufferStream = new Readable();
    bufferStream.push(buffer);
    bufferStream.push(null);
    bufferStream.pipe(uploadStream);
  });
};

export function uploadFile(req: Request, res: Response) {
  return uploadFileAsync(req, res).catch(error => {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload image',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  });
}

async function uploadFileAsync(req: Request, res: Response) {
  if (!req.file) {
    console.warn('uploadFile called without file');
    return res.status(400).json({ message: 'No file uploaded' });
  }

  console.log('Uploading file to Cloudinary:', {
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size
  });

  // Upload to Cloudinary
  const result = await uploadToCloudinary(req.file.buffer, 'blog-images');

  console.log('Cloudinary upload successful:', {
    public_id: result.public_id,
    secure_url: result.secure_url
  });

  res.status(201).json({
    url: result.secure_url,
    public_id: result.public_id,
    filename: result.public_id
  });
}

export { upload };
