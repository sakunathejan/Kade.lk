const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Missing Supabase environment variables. Please check your .env file.');
}

// Use service role key for backend operations (has higher privileges)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Storage bucket configuration
const STORAGE_BUCKET = 'product-images';

// Image upload configuration
const IMAGE_CONFIG = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  maxFiles: 10, // Maximum 10 images per product
};

module.exports = {
  supabase,
  STORAGE_BUCKET,
  IMAGE_CONFIG
};
