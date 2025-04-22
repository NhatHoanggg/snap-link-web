"use client";

import ImageUpload from "@/components/common/image-upload"
import { useState } from "react";

export default function Home() {
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const handleImageUploaded = (url: string) => {
    console.log('Image uploaded successfully, URL:', url);
    setUploadedImageUrl(url);
    console.log('Parent component state updated with URL:', uploadedImageUrl);
  };

  return (
    // <main className="flex min-h-screen flex-col items-center justify-center p-24">
    //   <h1 className="mb-8 text-2xl font-bold">Cloudinary Image Upload</h1>
      
    //   <ImageUpload onImageUploaded={handleImageUploaded} />
      
    //   {uploadedImageUrl && (
    //     <div className="mt-8 p-4 border rounded">
    //       <h2 className="text-lg font-medium">Parent Component State:</h2>
    //       <p className="mt-2">
    //         <strong>Image URL:</strong> <span className="break-all">{uploadedImageUrl}</span>
    //       </p>
    //     </div>
    //   )}
    // </main>
    <ImageUpload onImageUploaded={handleImageUploaded} />
  );
}