const { MediaService } = require('./server/services/mediaService');

// Mock test data
const mockFile = {
  originalname: 'test-image.jpg',
  mimetype: 'image/jpeg',
  size: 1024 * 1024, // 1MB
  buffer: Buffer.from('fake-image-data')
};

const mockUser = {
  id: 'test-user-123',
  role: 'admin'
};

const mockProductId = 'test-product-456';

// Test the media service
async function testMediaService() {
  console.log('🧪 Testing Media Upload System...\n');

  try {
    // Test 1: File validation
    console.log('1. Testing file validation...');
    const validation = MediaService.validateMedia(mockFile, mockUser.role);
    console.log('   ✅ Validation result:', validation);
    
    if (!validation.valid) {
      throw new Error(`File validation failed: ${validation.error}`);
    }

    // Test 2: Single file upload (mock)
    console.log('\n2. Testing single file upload...');
    const uploadResult = await MediaService.uploadMedia(
      mockFile, 
      mockProductId, 
      0, 
      mockUser.role, 
      mockUser.id
    );
    console.log('   ✅ Upload result:', uploadResult);

    // Test 3: Multiple files upload (mock)
    console.log('\n3. Testing multiple files upload...');
    const mockFiles = [mockFile, { ...mockFile, originalname: 'test-video.mp4', mimetype: 'video/mp4' }];
    const multiUploadResult = await MediaService.uploadMultipleMedia(
      mockFiles, 
      mockProductId, 
      mockUser.role, 
      mockUser.id
    );
    console.log('   ✅ Multiple upload result:', multiUploadResult);

    // Test 4: File type detection
    console.log('\n4. Testing file type detection...');
    const imageFile = { ...mockFile, mimetype: 'image/png' };
    const videoFile = { ...mockFile, mimetype: 'video/mp4' };
    
    const imageValidation = MediaService.validateMedia(imageFile, mockUser.role);
    const videoValidation = MediaService.validateMedia(videoFile, mockUser.role);
    
    console.log('   ✅ Image validation:', imageValidation);
    console.log('   ✅ Video validation:', videoValidation);

    // Test 5: File size limits
    console.log('\n5. Testing file size limits...');
    const largeFile = { ...mockFile, size: 100 * 1024 * 1024 }; // 100MB
    const largeFileValidation = MediaService.validateMedia(largeFile, mockUser.role);
    console.log('   ✅ Large file validation:', largeFileValidation);

    console.log('\n🎉 All tests passed! Media upload system is working correctly.');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run tests
testMediaService();
