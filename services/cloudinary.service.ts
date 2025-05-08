export async function uploadImage(file: File, preset: string): Promise<string> {
  try {
    // Create form data
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', preset) // Your Cloudinary upload preset

    // Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dy8p5yjsd/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    if (!response.ok) {
      throw new Error('Upload failed')
    }

    const data = await response.json()
    return data.secure_url
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
} 