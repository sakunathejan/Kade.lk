const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseServiceKey || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Please check your .env file.');
}

// Service role client for admin operations (has higher privileges)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Anon client for regular user operations
const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);

// Storage bucket configuration
const STORAGE_BUCKET = 'product-media';

// Media upload configuration
const MEDIA_CONFIG = {
  maxSize: 50 * 1024 * 1024, // 50MB for videos
  allowedImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  allowedVideoTypes: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv'],
  maxFiles: 10, // Maximum 10 media files per product
  maxImageSize: 5 * 1024 * 1024, // 5MB for images
  maxVideoSize: 50 * 1024 * 1024, // 50MB for videos
};

module.exports = {
  supabaseAdmin,
  supabaseAnon,
  STORAGE_BUCKET,
  MEDIA_CONFIG
};
