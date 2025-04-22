'use client';

import { useState } from 'react';
// import Image from 'next/image';

interface ImageUploadProps {
  onImageUploaded?: (url: string) => void;
}

export default function ImageUpload({ onImageUploaded }: ImageUploadProps) {
  // const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', files[0]);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      const uploadedUrl = data.secure_url;
      
      // setImageUrl(uploadedUrl);
      
      // Call the callback function with the URL
      if (onImageUploaded) {
        onImageUploaded(uploadedUrl);
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full max-w-md">
        <label
          htmlFor="image-upload"
          className="flex justify-center w-full p-4 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-50"
        >
          <div className="flex flex-col items-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
            <p className="mt-1 text-sm text-gray-600">
              {uploading ? 'Uploading...' : 'Click to upload image'}
            </p>
          </div>
          <input
            id="image-upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {/* {imageUrl && (
        <div className="mt-4">
          <p className="mb-2 text-sm font-medium">Uploaded Image:</p>
          <div className="relative w-64 h-64">
            <Image
              src={imageUrl}
              alt="Uploaded image"
              fill
              className="object-cover rounded-md"
            />
          </div>
          <p className="mt-2 text-xs break-all">{imageUrl}</p>
        </div>
      )} */}
    </div>
  );
}