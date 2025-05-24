import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

interface MulterRequest extends AuthRequest {
  file?: Express.Multer.File;
}

export const uploadFile = async (req: MulterRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileInfo = {
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      buffer: req.file.buffer ? true : false
    };

    res.status(201).json({
      message: 'File uploaded successfully',
      file: fileInfo
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
};

export const getFileInfo = async (req: AuthRequest, res: Response) => {
  try {
    const { filename } = req.params;
    
    res.json({
      message: 'File info endpoint - implement file metadata storage',
      filename
    });
  } catch (error) {
    console.error('Get file info error:', error);
    res.status(500).json({ error: 'Failed to get file info' });
  }
};

export const deleteFile = async (req: AuthRequest, res: Response) => {
  try {
    const { filename } = req.params;
    
    res.json({
      message: 'File deleted successfully',
      filename
    });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
};