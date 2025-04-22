'use client';

import { useState } from 'react';
import MultiImageUpload from '@/components/common/multi-image-upload';

export default function MultiUpload() {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  
  const handleImagesUploaded = (urls: string[]) => {
    console.log('Images uploaded:', urls);
    setImageUrls(urls);
  };
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="mb-8 text-2xl font-bold">Multi Image Upload</h1>
      
      <MultiImageUpload 
        onImagesUploaded={handleImagesUploaded} 
        maxImages={15} 
      />
      
      {imageUrls.length > 0 && (
        <div className="mt-8 p-4 border rounded">
          <h2 className="text-lg font-medium">Uploaded Images:</h2>
          <ul className="mt-2 space-y-2">
            {imageUrls.map((url, index) => (
              <li key={index} className="break-all">{url}</li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}