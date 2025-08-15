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
  getCategories
} = require('../controllers/productController');
const { protect, authorize, isApprovedSeller } = require('../middleware/auth');

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 10 // Maximum 10 files
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, isApprovedSeller, createProduct);

router.route('/categories')
  .get(getCategories);

router.route('/seller/:sellerId')
  .get(getProductsBySeller);

// Super Admin routes
router.route('/super-admin')
  .get(protect, authorize('superadmin'), getAllProductsSuperAdmin)
  .post(protect, authorize('superadmin'), upload.array('images', 10), createProductSuperAdmin);

router.route('/:id/super-admin')
  .put(protect, authorize('superadmin'), upload.array('images', 10), updateProductSuperAdmin)
  .delete(protect, authorize('superadmin'), deleteProductSuperAdmin);

router.route('/:id')
  .get(getProduct)
  .put(protect, isApprovedSeller, updateProduct)
  .delete(protect, isApprovedSeller, deleteProduct);

module.exports = router;
