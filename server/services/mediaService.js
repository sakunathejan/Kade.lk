const { supabaseAdmin, supabaseAnon, STORAGE_BUCKET, MEDIA_CONFIG } = require('../config/supabase');
const sharp = require('sharp');

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
   * Optimize image before upload (reduce size while maintaining quality)
   */
  static async optimizeImage(buffer, mimetype) {
    try {
      if (mimetype.startsWith('image/')) {
        const optimizedBuffer = await sharp(buffer)
          .resize(800, 800, { 
            fit: 'inside', 
            withoutEnlargement: true 
          })
          .jpeg({ quality: 80, progressive: true })
          .png({ quality: 80, progressive: true })
          .webp({ quality: 80 })
          .toBuffer();
        
        return optimizedBuffer;
      }
      return buffer; // Return original buffer for videos
    } catch (error) {
      console.warn('Image optimization failed, using original:', error.message);
      return buffer;
    }
  }

  /**
   * Generate unique filename with UUID
   */
  static generateUniqueFileName(originalName, productId, mediaIndex) {
    const fileExt = originalName.split('.').pop().toLowerCase();
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    return `${productId}_${mediaIndex}_${timestamp}_${randomId}.${fileExt}`;
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

      // Optimize image if it's an image file
      const optimizedBuffer = await this.optimizeImage(file.buffer, file.mimetype);
      
      // Generate unique filename
      const uniqueFileName = this.generateUniqueFileName(file.originalname, productId, mediaIndex);
      const filePath = `products/${productId}/${uniqueFileName}`;

      // Use appropriate Supabase client based on user role
      const supabaseClient = userRole === 'superadmin' ? supabaseAdmin : supabaseAnon;

      // Upload to Supabase storage
      const { data, error } = await supabaseClient.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, optimizedBuffer, {
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

      if (!urlData.publicUrl) {
        return { success: false, error: 'Failed to generate public URL' };
      }

      console.log(`✅ Media uploaded successfully: ${filePath} -> ${urlData.publicUrl}`);

      return { 
        success: true, 
        url: urlData.publicUrl,
        type: validation.type,
        path: filePath,
        filename: uniqueFileName,
        size: optimizedBuffer.length
      };
    } catch (error) {
      console.error('Media upload error:', error);
      return { success: false, error: 'Failed to upload media: ' + error.message };
    }
  }

  /**
   * Upload multiple media files to Supabase storage
   */
  static async uploadMultipleMedia(files, productId, userRole, userId) {
    if (!files || files.length === 0) {
      return [];
    }

    console.log(`🚀 Starting upload of ${files.length} media files for product ${productId}`);

    const uploadPromises = files.map((file, index) =>
      this.uploadMedia(file, productId, index, userRole, userId)
    );

    try {
      const results = await Promise.all(uploadPromises);
      
      // Log results
      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);
      
      console.log(`✅ Upload completed: ${successful.length} successful, ${failed.length} failed`);
      
      if (failed.length > 0) {
        console.error('❌ Failed uploads:', failed);
      }

      return results;
    } catch (error) {
      console.error('❌ Multiple media upload failed:', error);
      return files.map(() => ({ success: false, error: 'Upload failed: ' + error.message }));
    }
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
      const filePath = `products/${productId}/${fileName}`;

      // Use appropriate Supabase client based on user role
      const supabaseClient = userRole === 'superadmin' ? supabaseAdmin : supabaseAnon;

      const { error } = await supabaseClient.storage
        .from(STORAGE_BUCKET)
        .remove([filePath]);

      if (error) {
        console.error('Supabase delete error:', error);
        return { success: false, error: error.message };
      }

      console.log(`✅ Media deleted successfully: ${filePath}`);
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
      const filePath = `products/${productId}`;
      
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

  /**
   * Test Supabase connection and bucket access
   */
  static async testConnection() {
    try {
      const { data, error } = await supabaseAdmin.storage
        .from(STORAGE_BUCKET)
        .list('', { limit: 1 });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, message: 'Supabase connection successful' };
    } catch (error) {
      return { success: false, error: 'Connection failed: ' + error.message };
    }
  }
}

module.exports = MediaService;
