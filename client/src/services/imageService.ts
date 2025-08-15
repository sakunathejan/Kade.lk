import { supabase, STORAGE_BUCKET, IMAGE_CONFIG } from '../config/supabase';

export interface ImageFile {
  file: File;
  preview: string;
  id: string;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export interface DeleteResult {
  success: boolean;
  error?: string;
}

export class ImageService {
  /**
   * Validate image file
   */
  static validateImage(file: File): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > IMAGE_CONFIG.maxSize) {
      return {
        valid: false,
        error: `File size must be less than ${IMAGE_CONFIG.maxSize / (1024 * 1024)}MB`
      };
    }

    // Check file type
    if (!IMAGE_CONFIG.allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type must be one of: ${IMAGE_CONFIG.allowedTypes.join(', ')}`
      };
    }

    return { valid: true };
  }

  /**
   * Upload single image to Supabase storage
   */
  static async uploadImage(
    file: File,
    productId: string,
    imageIndex: number
  ): Promise<UploadResult> {
    try {
      // Validate file
      const validation = this.validateImage(file);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${productId}_${imageIndex}_${Date.now()}.${fileExt}`;
      const filePath = `${productId}/${fileName}`;

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Supabase upload error:', error);
        return { success: false, error: error.message };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filePath);

      return { success: true, url: urlData.publicUrl };
    } catch (error) {
      console.error('Image upload error:', error);
      return { success: false, error: 'Failed to upload image' };
    }
  }

  /**
   * Upload multiple images to Supabase storage
   */
  static async uploadMultipleImages(
    files: File[],
    productId: string
  ): Promise<UploadResult[]> {
    const uploadPromises = files.map((file, index) =>
      this.uploadImage(file, productId, index)
    );

    return Promise.all(uploadPromises);
  }

  /**
   * Delete image from Supabase storage
   */
  static async deleteImage(imageUrl: string): Promise<DeleteResult> {
    try {
      // Extract file path from URL
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const productId = urlParts[urlParts.length - 2];
      const filePath = `${productId}/${fileName}`;

      const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([filePath]);

      if (error) {
        console.error('Supabase delete error:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Image delete error:', error);
      return { success: false, error: 'Failed to delete image' };
    }
  }

  /**
   * Delete multiple images from Supabase storage
   */
  static async deleteMultipleImages(imageUrls: string[]): Promise<DeleteResult[]> {
    const deletePromises = imageUrls.map(url => this.deleteImage(url));
    return Promise.all(deletePromises);
  }

  /**
   * Get all images for a product
   */
  static async getProductImages(productId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .list(productId);

      if (error) {
        console.error('Error fetching product images:', error);
        return [];
      }

      return data
        .map(file => {
          const { data: urlData } = supabase.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(`${productId}/${file.name}`);
          return urlData.publicUrl;
        })
        .filter(Boolean);
    } catch (error) {
      console.error('Error getting product images:', error);
      return [];
    }
  }

  /**
   * Create image preview URL
   */
  static createPreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  /**
   * Clean up preview URLs to prevent memory leaks
   */
  static revokePreviewUrl(url: string): void {
    URL.revokeObjectURL(url);
  }
}
