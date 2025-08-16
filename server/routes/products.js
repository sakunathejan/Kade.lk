const express = require('express');
const multer = require('multer');
const { 
  getProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  getProductsBySeller,
  createProductSuperAdmin,
  updateProductSuperAdmin,
  deleteProductSuperAdmin,
  getAllProductsSuperAdmin,
  getCategories,
  getSimilarProducts,
  getRelatedProducts,
  getProductBySlug
} = require('../controllers/productController');
const { protect, authorize, isApprovedSeller } = require('../middleware/auth');
const MediaService = require('../services/mediaService');

// Configure multer for media uploads (images and videos)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit for videos
    files: 10 // Maximum 10 files
  },
  fileFilter: (req, file, cb) => {
    // Check file type - allow both images and videos
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'), false);
    }
  }
});

const router = express.Router();

// Test Supabase connection
router.get('/test-supabase', async (req, res) => {
  try {
    const result = await MediaService.testConnection();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.route('/')
  .get(getProducts)
  .post(protect, isApprovedSeller, upload.array('media', 10), createProduct);

router.route('/categories')
  .get(getCategories);

router.route('/seller/:sellerId')
  .get(getProductsBySeller);

// Super Admin routes
router.route('/super-admin')
  .get(protect, authorize('superadmin'), getAllProductsSuperAdmin)
  .post(protect, authorize('superadmin'), upload.array('media', 10), createProductSuperAdmin);

router.route('/:id/super-admin')
  .put(protect, authorize('superadmin'), upload.array('media', 10), updateProductSuperAdmin)
  .delete(protect, authorize('superadmin'), deleteProductSuperAdmin);

// Route to get product by slug (MUST come before /:id routes)
router.route('/slug/:slug')
  .get(getProductBySlug);

router.route('/:id/similar')
  .get(getSimilarProducts);

router.route('/:id/related')
  .get(getRelatedProducts);

router.route('/:id')
  .get(getProduct)
  .put(protect, isApprovedSeller, upload.array('media', 10), updateProduct)
  .delete(protect, isApprovedSeller, deleteProduct);

module.exports = router;
