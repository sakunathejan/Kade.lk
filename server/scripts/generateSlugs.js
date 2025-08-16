const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

// Function to generate slug from product name
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim('-'); // Remove leading/trailing hyphens
}

// Function to make slug unique
async function makeSlugUnique(slug, productId) {
  let uniqueSlug = slug;
  let counter = 1;
  
  while (true) {
    const existingProduct = await Product.findOne({ 
      slug: uniqueSlug, 
      _id: { $ne: productId } 
    });
    
    if (!existingProduct) {
      break;
    }
    
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }
  
  return uniqueSlug;
}

async function generateSlugsForAllProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all products without slugs
    const products = await Product.find({ slug: { $exists: false } });
    console.log(`Found ${products.length} products without slugs`);

    let updatedCount = 0;
    let errorCount = 0;

    for (const product of products) {
      try {
        if (product.name) {
          const baseSlug = generateSlug(product.name);
          const uniqueSlug = await makeSlugUnique(baseSlug, product._id);
          
          product.slug = uniqueSlug;
          await product.save();
          
          console.log(`Updated product "${product.name}" with slug: ${uniqueSlug}`);
          updatedCount++;
        }
      } catch (error) {
        console.error(`Error updating product ${product._id}:`, error.message);
        errorCount++;
      }
    }

    console.log(`\nSlug generation completed!`);
    console.log(`Successfully updated: ${updatedCount} products`);
    console.log(`Errors: ${errorCount} products`);

    // Also update products with empty slugs
    const productsWithEmptySlugs = await Product.find({ 
      slug: { $exists: true, $in: ['', null, undefined] } 
    });
    
    if (productsWithEmptySlugs.length > 0) {
      console.log(`\nFound ${productsWithEmptySlugs.length} products with empty slugs`);
      
      for (const product of productsWithEmptySlugs) {
        try {
          if (product.name) {
            const baseSlug = generateSlug(product.name);
            const uniqueSlug = await makeSlugUnique(baseSlug, product._id);
            
            product.slug = uniqueSlug;
            await product.save();
            
            console.log(`Updated product "${product.name}" with slug: ${uniqueSlug}`);
            updatedCount++;
          }
        } catch (error) {
          console.error(`Error updating product ${product._id}:`, error.message);
          errorCount++;
        }
      }
    }

    console.log(`\nFinal Summary:`);
    console.log(`Total products updated: ${updatedCount}`);
    console.log(`Total errors: ${errorCount}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
generateSlugsForAllProducts();
