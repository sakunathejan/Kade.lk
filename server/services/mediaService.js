const { supabaseAdmin, supabaseAnon, STORAGE_BUCKET, MEDIA_CONFIG } = require('../config/supabase');

class MediaService {
  /**
   * Validate media file (image or video)
   */
  static validateMedia(file, userRole) {
    const isImage = MEDIA_CONFIG.allowedImageTypes.includes(file.mimetype);
    const isVideo = MEDIA_CONFIG.allowedVideoTypes.includes(file.mimetype);

    if (!isImage && !isVideo) {
      return {
        valid: false,
        error: `File type must be one of: ${[...MEDIA_CONFIG.allowedImageTypes, ...MEDIA_CONFIG.allowedVideoTypes].join(', ')}`
      };
    }

    // Check file size based on type
    const maxSize = isImage ? MEDIA_CONFIG.maxImageSize : MEDIA_CONFIG.maxVideoSize;
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `${isImage ? 'Image' : 'Video'} file size must be less than ${maxSize / (1024 * 1024)}MB`
      };
    }

    return { valid: true, type: isImage ? 'image' : 'video' };
  }

  /**
   * Upload single media file to Supabase storage
   */
  static async uploadMedia(file, productId, mediaIndex, userRole, userId) {
    try {
      // Validate file
      const validation = this.validateMedia(file, userRole);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      // Generate unique filename
      const fileExt = file.originalname.split('.').pop();
      const uniqueFileName = `${productId}_${mediaIndex}_${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${productId}/${uniqueFileName}`;

      // Use appropriate Supabase client based on user role
      const supabaseClient = userRole === 'superadmin' ? supabaseAdmin : supabaseAnon;

      // Upload to Supabase storage
      const { data, error } = await supabaseClient.storage
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
      const { data: urlData } = supabaseClient.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filePath);

      return { 
        success: true, 
        url: urlData.publicUrl,
        type: validation.type,
        path: filePath
      };
    } catch (error) {
      console.error('Media upload error:', error);
      return { success: false, error: 'Failed to upload media' };
    }
  }

  /**
   * Upload multiple media files to Supabase storage
   */
  static async uploadMultipleMedia(files, productId, userRole, userId) {
    const uploadPromises = files.map((file, index) =>
      this.uploadMedia(file, productId, index, userRole, userId)
    );

    return Promise.all(uploadPromises);
  }

  /**
   * Delete media file from Supabase storage
   */
  static async deleteMedia(imageUrl, userRole, userId) {
    try {
      // Extract file path from URL
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const productId = urlParts[urlParts.length - 2];
      const filePath = `${userId}/${productId}/${fileName}`;

      // Use appropriate Supabase client based on user role
      const supabaseClient = userRole === 'superadmin' ? supabaseAdmin : supabaseAnon;

      const { error } = await supabaseClient.storage
        .from(STORAGE_BUCKET)
        .remove([filePath]);

      if (error) {
        console.error('Supabase delete error:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Media delete error:', error);
      return { success: false, error: 'Failed to delete media' };
    }
  }

  /**
   * Delete multiple media files from Supabase storage
   */
  static async deleteMultipleMedia(mediaUrls, userRole, userId) {
    const deletePromises = mediaUrls.map(url => this.deleteMedia(url, userRole, userId));
    return Promise.all(deletePromises);
  }

  /**
   * Get all media for a product
   */
  static async getProductMedia(productId, userRole, userId) {
    try {
      const filePath = `${userId}/${productId}`;
      
      // Use appropriate Supabase client based on user role
      const supabaseClient = userRole === 'superadmin' ? supabaseAdmin : supabaseAnon;

      const { data, error } = await supabaseClient.storage
        .from(STORAGE_BUCKET)
        .list(filePath);

      if (error) {
        console.error('Error fetching product media:', error);
        return [];
      }

      return data
        .map(file => {
          const { data: urlData } = supabaseClient.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(`${filePath}/${file.name}`);
          
          // Determine media type from file extension
          const fileExt = file.name.split('.').pop().toLowerCase();
          const isImage = ['jpg', 'jpeg', 'png', 'webp'].includes(fileExt);
          const isVideo = ['mp4', 'avi', 'mov', 'wmv', 'flv'].includes(fileExt);
          
          return {
            url: urlData.publicUrl,
            name: file.name,
            type: isImage ? 'image' : isVideo ? 'video' : 'unknown',
            size: file.metadata?.size || 0
          };
        })
        .filter(media => media.type !== 'unknown');
    } catch (error) {
      console.error('Error getting product media:', error);
      return [];
    }
  }

  /**
   * Update product media (replace existing media)
   */
  static async updateProductMedia(files, productId, userRole, userId, existingMediaUrls = []) {
    try {
      // Delete existing media if provided
      if (existingMediaUrls.length > 0) {
        await this.deleteMultipleMedia(existingMediaUrls, userRole, userId);
      }

      // Upload new media
      const uploadResults = await this.uploadMultipleMedia(files, productId, userRole, userId);

      // Check upload results
      const failedUploads = uploadResults.filter(result => !result.success);
      if (failedUploads.length > 0) {
        console.warn('Some media files failed to upload:', failedUploads);
      }

      return uploadResults;
    } catch (error) {
      console.error('Error updating product media:', error);
      throw error;
    }
  }
}

module.exports = MediaService;
