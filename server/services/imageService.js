const { supabase, STORAGE_BUCKET, IMAGE_CONFIG } = require('../config/supabase');

class ImageService {
  /**
   * Validate image file
   */
  static validateImage(file) {
    // Check file size
    if (file.size > IMAGE_CONFIG.maxSize) {
      return {
        valid: false,
        error: `File size must be less than ${IMAGE_CONFIG.maxSize / (1024 * 1024)}MB`
      };
    }

    // Check file type
    if (!IMAGE_CONFIG.allowedTypes.includes(file.mimetype)) {
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
  static async uploadImage(file, productId, imageIndex) {
    try {
      // Generate unique filename
      const fileExt = file.originalname.split('.').pop();
      const uniqueFileName = `${productId}_${imageIndex}_${Date.now()}.${fileExt}`;
      const filePath = `${productId}/${uniqueFileName}`;

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
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
  static async uploadMultipleImages(files, productId) {
    const uploadPromises = files.map((file, index) =>
      this.uploadImage(file, productId, index)
    );

    return Promise.all(uploadPromises);
  }

  /**
   * Delete image from Supabase storage
   */
  static async deleteImage(imageUrl) {
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
  static async deleteMultipleImages(imageUrls) {
    const deletePromises = imageUrls.map(url => this.deleteImage(url));
    return Promise.all(deletePromises);
  }

  /**
   * Get all images for a product
   */
  static async getProductImages(productId) {
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
}

module.exports = ImageService;
