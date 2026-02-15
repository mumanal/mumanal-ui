// Límites
export const MAX_FILE_SIZE_MB = 5; // 5 MB
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
export const MAX_IMAGES_PER_PRODUCT = 3;

// Carpetas permitidas (Deben coincidir con lo que espera tu backend)
export const STORAGE_FOLDERS = {
    PRODUCTS: 'products',
    PACKAGES: 'packages',
    PROFILES: 'profiles',
    QRS: 'qrs'
} as const;

export type StorageFolder = typeof STORAGE_FOLDERS[keyof typeof STORAGE_FOLDERS];