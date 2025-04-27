const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export async function uploadImage(file: File): Promise<string> {
  console.log('Cloudinary config:', { cloudName, uploadPreset });
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset!);

  console.log('Sending request to Cloudinary...');
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  console.log('Cloudinary response status:', res.status);
  const data = await res.json();
  console.log('Cloudinary response data:', data);

  if (!res.ok) {
    throw new Error(`Cloudinary upload failed: ${data.error?.message || 'Unknown error'}`);
  }

  return data.secure_url as string;
}
