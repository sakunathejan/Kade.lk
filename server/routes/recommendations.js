const express = require('express');
const router = express.Router();

// @desc    Get home recommendations
// @route   GET /api/recommendations/home
// @access  Public
router.get('/home', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      featured: [],
      trending: [],
      newArrivals: []
    }
  });
});

module.exports = router;
