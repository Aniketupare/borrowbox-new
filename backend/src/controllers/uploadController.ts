import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import { Request, Response } from 'express';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  const streamUpload = (req: Request) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream((error, result) => {
        if (result) resolve(result);
        else reject(error);
      });
      streamifier.createReadStream(req.file!.buffer).pipe(stream);
    });
  };

  try {
    const result: any = await streamUpload(req);
    res.status(200).json({ url: result.secure_url });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading image' });
  }
};
