/**
 * Simple image upload utility
 * Converts image files to base64 data URLs for storage
 * Can be enhanced later with cloud storage (Cloudinary, AWS S3, etc.)
 */

export async function uploadImageToCloudinary(
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    // Validate file
    if (!file.type.startsWith('image/')) {
      reject(new Error('File must be an image'));
      return;
    }

    // Validate size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      reject(new Error('Image size must be less than 5MB'));
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    
    // Simulate progress if callback is provided
    if (onProgress) {
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 10;
        if (progress < 90) {
          onProgress(progress);
        } else {
          clearInterval(progressInterval);
        }
      }, 50);
      
      reader.onload = () => {
        clearInterval(progressInterval);
        onProgress(100);
        const result = reader.result as string;
        resolve(result);
      };
      
      reader.onerror = () => {
        clearInterval(progressInterval);
        reject(new Error('Failed to read image file'));
      };
    } else {
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read image file'));
      };
    }
    
    reader.readAsDataURL(file);
  });
}

/**
 * Validate if a string is a valid image URL
 */
export function isValidImageUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(urlObj.pathname) || url.startsWith('data:image/');
  } catch {
    return url.startsWith('data:image/') || url.startsWith('/');
  }
}
