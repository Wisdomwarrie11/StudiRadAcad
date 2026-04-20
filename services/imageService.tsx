
import imageCompression from 'browser-image-compression';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

/**
 * Validates and compresses an image file.
 */
export const processAndCompressImage = async (file: File): Promise<File> => {
  // 1. Basic Validation (Limit 20MB)
  if (file.size > 20 * 1024 * 1024) {
    throw new Error('Image is too large (max 20MB allowed).');
  }

  // 2. Skip compression if already reasonably small
  if (file.size <= 800 * 1024) return file; 

  const options = {
    maxSizeMB: 0.8,
    maxWidthOrHeight: 1600,
    useWebWorker: true,
    initialQuality: 0.75,
  };

  try {
    return await imageCompression(file, options);
  } catch (error) {
    console.warn("Compression encountered an issue, using original:", error);
    return file;
  }
};

/**
 * Real Firebase Resumable Upload
 * Handles network instability better than standard uploadBytes.
 */
export const uploadImageToStorage = async (
  file: File, 
  onProgress: (percent: number) => void
): Promise<string> => {
  const storageRef = ref(storage, `blogImages/${Date.now()}_${file.name.replace(/\s+/g, '_')}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(Math.floor(progress));
      },
      (error) => {
        console.error("Firebase Storage Error:", error);
        reject(new Error(`Upload failed: ${error.message}`));
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
};
