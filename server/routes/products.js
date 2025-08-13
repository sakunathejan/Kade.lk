const express = require('express');
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getProductsBySeller } = require('../controllers/productController');
const { protect, authorize, isApprovedSeller } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, isApprovedSeller, createProduct);

router.route('/seller/:sellerId')
  .get(getProductsBySeller);

router.route('/:id')
  .get(getProduct)
  .put(protect, isApprovedSeller, updateProduct)
  .delete(protect, isApprovedSeller, deleteProduct);

module.exports = router;
