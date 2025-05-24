import React, { useState, useRef } from 'react';
import { fileUploadService } from '../api/fileUploadService';
import { toast } from 'react-toastify';
import type { FileInfo } from '../types';

interface FileUploaderProps {
  onFileUploaded?: (fileInfo: FileInfo) => void;
  buttonText?: string;
  acceptedFileTypes?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFileUploaded,
  buttonText = 'Upload File',
  acceptedFileTypes = '.pdf,.doc,.docx,.txt'
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsUploading(true);

    try {
      const fileInfo = await fileUploadService.uploadFile(file);
      toast.success(`File "${file.name}" uploaded successfully`);
      
      if (onFileUploaded) {
        onFileUploaded(fileInfo);
      }
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="file-uploader">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        style={{ display: 'none' }}
        accept={acceptedFileTypes}
      />
      <button
        type="button"
        onClick={triggerFileInput}
        disabled={isUploading}
        className="upload-btn"
      >
        {isUploading ? 'Uploading...' : buttonText}
      </button>
    </div>
  );
};

export default FileUploader;
