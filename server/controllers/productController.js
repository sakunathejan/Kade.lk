const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');
const MediaService = require('../services/mediaService');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    console.log('getProducts called with query:', req.query);
    
    let query = Product.find({ isActive: true });

    // Handle category filtering explicitly
    if (req.query.category && req.query.category !== 'all') {
      console.log('Filtering by category:', req.query.category);
      query = query.where('category', req.query.category);
    }

    // Handle subcategory filtering
    if (req.query.subcategory) {
      console.log('Filtering by subcategory:', req.query.subcategory);
      query = query.where('subcategory', req.query.subcategory);
    }

    // Copy req.query for other filters
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit', 'category'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string for other filters
    let queryStr = JSON.stringify(reqQuery);
    
    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Apply other filters if they exist
    if (Object.keys(JSON.parse(queryStr)).length > 0) {
      query = query.find(JSON.parse(queryStr));
    }

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    // Get total count with the same filters
    const countQuery = Product.find({ isActive: true });
    if (req.query.category && req.query.category !== 'all') {
      countQuery.where('category', req.query.category);
    }
    if (req.query.subcategory) {
      countQuery.where('subcategory', req.query.subcategory);
    }
    const total = await countQuery.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Executing query
    console.log('Final query:', query.getQuery());
    const products = await query.populate('seller', 'name email');
    console.log('Found products:', products.length);

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: products.length,
      pagination,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name email');

    if (!product) {
      return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
    }

    // Increment views
    product.views += 1;
    await product.save();

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product (Seller/Admin)
// @route   POST /api/products
// @access  Private (Seller/Admin)
exports.createProduct = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.seller = req.user.id;

    const product = await Product.create(req.body);

    // Handle media uploads if files are present
    if (req.files && req.files.length > 0) {
      try {
        // Upload media to Supabase
        const uploadResults = await MediaService.uploadMultipleMedia(
          req.files, 
          product._id, 
          req.user.role, 
          req.user.id
        );

        // Check upload results
        const failedUploads = uploadResults.filter(result => !result.success);
        if (failedUploads.length > 0) {
          console.warn('Some media files failed to upload:', failedUploads);
        }

        // Update product with media URLs
        const mediaUrls = uploadResults
          .filter(result => result.success)
          .map(result => ({ 
            url: result.url, 
            type: result.type 
          }));

        if (mediaUrls.length > 0) {
          product.media = mediaUrls;
          await product.save();
        }
      } catch (uploadError) {
        console.error('Media upload error:', uploadError);
        // Don't fail the entire request if media upload fails
        // Product is still created, just without media
      }
    }

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product (Super Admin)
// @route   POST /api/products/super-admin
// @access  Private (Super Admin)
exports.createProductSuperAdmin = async (req, res, next) => {
  try {
    // Super admin can create products for any seller
    if (!req.body.seller) {
      return next(new ErrorResponse('Seller ID is required', 400));
    }

    // Create product first
    const productData = {
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      category: req.body.category,
      subcategory: req.body.subcategory,
      stock: parseInt(req.body.stock),
      seller: req.body.seller,
      media: [] // Will be populated after media upload
    };

    const product = await Product.create(productData);

    // Handle media uploads if files are present
    if (req.files && req.files.length > 0) {
      try {
        // Upload media to Supabase using superadmin privileges
        const uploadResults = await MediaService.uploadMultipleMedia(
          req.files, 
          product._id, 
          'superadmin', 
          req.body.seller // Use the seller's ID for file organization
        );

        // Check upload results
        const failedUploads = uploadResults.filter(result => !result.success);
        if (failedUploads.length > 0) {
          console.warn('Some media files failed to upload:', failedUploads);
        }

        // Update product with media URLs
        const mediaUrls = uploadResults
          .filter(result => result.success)
          .map(result => ({ 
            url: result.url, 
            type: result.type 
          }));

        if (mediaUrls.length > 0) {
          product.media = mediaUrls;
          await product.save();
        }
      } catch (uploadError) {
        console.error('Media upload error:', uploadError);
        // Don't fail the entire request if media upload fails
        // Product is still created, just without media
      }
    }

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Seller)
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is product owner
    if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this product`, 403));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product (Super Admin)
// @route   PUT /api/products/:id/super-admin
// @access  Private (Super Admin)
exports.updateProductSuperAdmin = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
    }

    // Handle media uploads if new files are present
    if (req.files && req.files.length > 0) {
      try {
        // Upload new media to Supabase
        const uploadResults = await MediaService.uploadMultipleMedia(
          req.files, 
          product._id, 
          'superadmin', 
          req.user.id // Use superadmin's ID for file organization
        );

        // Check upload results
        const failedUploads = uploadResults.filter(result => !result.success);
        if (failedUploads.length > 0) {
          console.warn('Some media files failed to upload:', failedUploads);
        }

        // Get new media URLs
        const newMediaUrls = uploadResults
          .filter(result => result.success)
          .map(result => ({ 
            url: result.url, 
            type: result.type 
          }));

        // Combine with existing media
        const existingMedia = product.media || [];
        req.body.media = [...existingMedia, ...newMediaUrls];
      } catch (uploadError) {
        console.error('Media upload error:', uploadError);
        return next(new ErrorResponse('Failed to upload media', 500));
      }
    }

    // Super admin can update any product
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Seller)
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is product owner
    if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this product`, 403));
    }

    await product.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product (Super Admin)
// @route   DELETE /api/products/:id/super-admin
// @access  Private (Super Admin)
exports.deleteProductSuperAdmin = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
    }

    // Delete associated media from Supabase if they exist
    if (product.media && product.media.length > 0) {
      try {
        const mediaUrls = product.media.map(media => media.url);
        await MediaService.deleteMultipleMedia(mediaUrls);
      } catch (deleteError) {
        console.error('Failed to delete media from Supabase:', deleteError);
        // Continue with product deletion even if media deletion fails
      }
    }

    // Super admin can delete any product
    await product.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get products by seller
// @route   GET /api/products/seller/:sellerId
// @access  Public
exports.getProductsBySeller = async (req, res, next) => {
  try {
    const products = await Product.find({ 
      seller: req.params.sellerId,
      isActive: true 
    }).populate('seller', 'name email');

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products (Super Admin)
// @route   GET /api/products/super-admin
// @access  Private (Super Admin)
exports.getAllProductsSuperAdmin = async (req, res, next) => {
  try {
    let query = Product.find();

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    
    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    query = query.find(JSON.parse(queryStr));

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Product.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const products = await query.populate('seller', 'name email');

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: products.length,
      pagination,
      total,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all unique categories
// @route   GET /api/products/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct('category', { isActive: true });
    console.log('Available categories:', categories);
    
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};
