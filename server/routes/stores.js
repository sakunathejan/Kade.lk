const express = require('express');
const router = express.Router();

// @desc    Get store highlights
// @route   GET /api/stores/highlights
// @access  Public
router.get('/highlights', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      featured: [],
      topRated: [],
      newStores: []
    }
  });
});

module.exports = router;
