'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface MultiImageUploadProps {
  onImagesUploaded?: (urls: string[]) => void;
  maxImages?: number;
  initialImages?: string[];
}

export default function MultiImageUpload({
  onImagesUploaded,
  maxImages = 10,
  initialImages = [],
}: MultiImageUploadProps) {
  const [uploadedImages, setUploadedImages] = useState<string[]>(initialImages);
  const [pendingImages, setPendingImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ Gọi callback khi uploadedImages thay đổi
  useEffect(() => {
    if (onImagesUploaded) {
      onImagesUploaded(uploadedImages);
    }
  }, [uploadedImages, onImagesUploaded]);

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files);

    if (uploadedImages.length + pendingImages.length + filesArray.length > maxImages) {
      setError(`You can only upload a maximum of ${maxImages} images`);
      return;
    }

    setPendingImages((prev) => [...prev, ...filesArray]);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removePendingImage = (indexToRemove: number) => {
    setPendingImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const removeUploadedImage = (indexToRemove: number) => {
    setUploadedImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const uploadImages = async () => {
    if (pendingImages.length === 0) return;

    setUploading(true);
    setError(null);

    const newUploadedUrls: string[] = [];
    const failedUploads: string[] = [];

    try {
      for (const file of pendingImages) {
        try {
          const formData = new FormData();
          formData.append('file', file);

          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`Failed to upload ${file.name}`);
          }

          const data = await response.json();
          newUploadedUrls.push(data.secure_url);
        } catch (err) {
          console.error(`Error uploading ${file.name}:`, err);
          failedUploads.push(file.name);
        }
      }

      setUploadedImages((prev) => [...prev, ...newUploadedUrls]);
      setPendingImages([]);

      if (failedUploads.length > 0) {
        setError(`Failed to upload: ${failedUploads.join(', ')}`);
      }
    } catch (err) {
      console.error('Error in batch upload:', err);
      setError('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload interface */}
      <div className="space-y-4">
        <div className="flex gap-4 items-center">
          <label
            htmlFor="multi-image-upload"
            className={`flex justify-center px-4 py-2 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-50 ${
              uploadedImages.length >= maxImages ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                ></path>
              </svg>
              <span>Select Images</span>
            </div>
            <input
              id="multi-image-upload"
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleFileSelection}
              disabled={uploadedImages.length >= maxImages || uploading}
            />
          </label>

          {pendingImages.length > 0 && (
            <button
              onClick={uploadImages}
              disabled={uploading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
            >
              {uploading ? 'Uploading...' : `Upload ${pendingImages.length} Image${pendingImages.length !== 1 ? 's' : ''}`}
            </button>
          )}
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {/* Pending images preview */}
      {pendingImages.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Pending Images</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {pendingImages.map((file, index) => (
              <div key={`pending-${index}`} className="relative group border rounded-md overflow-hidden">
                <div className="relative h-32 w-full bg-gray-100 flex items-center justify-center">
                  <div className="absolute inset-0">
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={`Pending image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <button
                  onClick={() => removePendingImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
                <div className="p-2">
                  <p className="text-xs truncate">{file.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Uploaded images */}
      {uploadedImages.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Uploaded Images</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {uploadedImages.map((url, index) => (
              <div key={`uploaded-${index}`} className="relative group border rounded-md overflow-hidden">
                <div className="relative h-32 w-full">
                  <Image
                    src={url}
                    alt={`Uploaded image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  onClick={() => removeUploadedImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
                <div className="p-2">
                  <p className="text-xs truncate">{url.split('/').pop()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
