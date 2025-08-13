const express = require('express');
const { createOrder, getOrders, getOrder, updateOrderStatus } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getOrders)
  .post(protect, createOrder);

router.route('/:id')
  .get(protect, getOrder)
  .put(protect, updateOrderStatus);

module.exports = router;
