export default async function uploadToCloudinary(file) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  if (!cloudName || !uploadPreset)
    throw new Error("Cloudinary is not configured.")

  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", uploadPreset)
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    {
      method: "POST",
      body: formData,
    },
  )
  if (!response.ok) throw new Error("Upload failed.")
  const data = await response.json()
  return data.secure_url
}
