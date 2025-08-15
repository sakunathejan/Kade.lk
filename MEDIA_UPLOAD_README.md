# Media Upload System Implementation

## Overview
This system allows super admins, admins, and sellers to upload both images and videos to Supabase storage with proper authentication and role-based permissions.

## Architecture

### Backend Components

#### 1. Media Service (`server/services/mediaService.js`)
- Handles file validation for both images and videos
- Supports multiple file uploads
- Role-based access control
- Automatic file organization by user ID and product ID

#### 2. Supabase Configuration (`server/config/supabase.js`)
- **Service Role Key**: Used for super admin operations
- **Anon Key**: Used for regular user operations
- Proper separation of concerns for security

#### 3. Product Controller Updates
- Integrated media upload with product creation/updates
- Supports both images and videos
- Maintains backward compatibility

### Frontend Components

#### 1. MediaUpload Component (`client/src/components/ui/MediaUpload.tsx`)
- Drag & drop interface
- Preview for both images and videos
- File type validation
- Configurable accepted file types

#### 2. ProductManagement Updates
- Uses new MediaUpload component
- Supports media array instead of just images

## File Types Supported

### Images
- JPG, JPEG, PNG, WebP
- Maximum size: 5MB per file

### Videos
- MP4, AVI, MOV, WMV, FLV
- Maximum size: 50MB per file

## User Roles & Permissions

### Super Admin
- Can upload media for any seller
- Uses service role key for full access
- Can manage all products and media

### Admin/Seller
- Can upload media for their own products
- Uses anon key with proper RLS policies
- Limited to their own data

## Security Features

1. **JWT Authentication**: All uploads require valid user tokens
2. **Role Validation**: Middleware checks user permissions
3. **File Type Validation**: Server-side validation of file types
4. **Size Limits**: Configurable file size restrictions
5. **User Isolation**: Files organized by user ID to prevent cross-access

## API Endpoints

### Create Product with Media
```
POST /api/products
POST /api/products/super-admin
```

### Update Product with Media
```
PUT /api/products/:id
PUT /api/products/:id/super-admin
```

## Environment Variables Required

```bash
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
```

## Usage Examples

### Frontend - Using MediaUpload Component
```tsx
import MediaUpload from '../ui/MediaUpload';

<MediaUpload
  media={selectedMedia}
  onMediaChange={setSelectedMedia}
  maxFiles={10}
  acceptedTypes={['image', 'video']}
/>
```

### Backend - Creating Product with Media
```javascript
// Files are automatically handled by multer middleware
// MediaService.uploadMultipleMedia handles the upload to Supabase
const uploadResults = await MediaService.uploadMultipleMedia(
  req.files, 
  product._id, 
  req.user.role, 
  req.user.id
);
```

## File Organization in Supabase

Files are organized in the following structure:
```
product-media/
├── {userId}/
│   ├── {productId}/
│   │   ├── {productId}_0_{timestamp}.jpg
│   │   ├── {productId}_1_{timestamp}.mp4
│   │   └── ...
```

## Migration Notes

- Existing products with `images` array will continue to work
- New products will use the `media` array with type information
- Backward compatibility maintained for existing functionality

## Error Handling

- File validation errors return appropriate HTTP status codes
- Upload failures don't prevent product creation
- Detailed error logging for debugging
- Graceful fallbacks for failed operations

## Performance Considerations

- Files are uploaded in parallel for better performance
- Preview URLs are created client-side for immediate feedback
- Proper cleanup of temporary preview URLs
- Efficient file organization for quick retrieval
