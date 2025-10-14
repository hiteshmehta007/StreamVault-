import { FileValidationResult } from '../types/upload';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB
const ALLOWED_FILE_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];

export function validateFile(file: File): FileValidationResult {
  const errors: string[] = [];

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    errors.push('Invalid file type. Only MP4, WebM, and OGG formats are allowed.');
  }

  if (file.size > MAX_FILE_SIZE) {
    errors.push('File size exceeds the maximum limit of 100 MB.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}