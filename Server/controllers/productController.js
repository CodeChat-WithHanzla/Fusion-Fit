const Product = require("../models/Product");
const asyncHandler = require("../helpers/asyncHandler");
const ErrorHandler = require("../helpers/errorHandler");
const cloudinary = require("../config/cloudinaryConfig");

// Fetch products with filters and sorting
// Get products with filters, sorting, and pagination
exports.getProducts = async (req, res, next) => {
  try {
    const { targetShape, sortBy, page = 1 } = req.query;

    const filter = {};
    if (targetShape) {
      filter.targetShapes = { $in: [targetShape] }; // Use $in operator to match any of the values in targetShapes array
    }

    let sort = {};
    if (sortBy === "priceLowToHigh") {
      sort.price = 1;
    } else if (sortBy === "priceHighToLow") {
      sort.price = -1;
    } else if (sortBy === "newest") {
      sort.createdAt = -1;
    } else {
      sort = {}; // Default sort order
    }

    const limit = 20;
    const skip = (page - 1) * limit;

    const totalProducts = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      products,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: Number(page)
    });
  } catch (error) {
    next(error);
  }
};

// Add a new product
exports.listProduct = asyncHandler(async (req, res) => {
  const { name, description, price, targetShapes, type, stock } = req.body;
  const images = req.files;

  // Validate required fields
  if (
    !name ||
    !description ||
    !price ||
    !Array.isArray(targetShapes) ||
    targetShapes.length === 0 ||
    !type ||
    !stock
  ) {
    return res.status(400).json({
      message: "All fields are required, including targetShapes and type."
    });
  }

  if (!images || images.length === 0) {
    return res
      .status(400)
      .json({ message: "Please upload at least one image." });
  }

  if (!req.user || !req.user.id) {
    return res
      .status(401)
      .json({ message: "Authentication failed. User ID not found." });
  }

  // Upload images to Cloudinary
  const imageGallery = [];
  const imageGalleryIds = [];

  const uploadPromises = images.map(
    (image) =>
      new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { folder: `products/${type}`, resource_type: "auto" },
            (error, result) => {
              if (error) {
                reject("Error uploading to Cloudinary:", error);
              } else {
                imageGallery.push(result.secure_url);
                imageGalleryIds.push(result.public_id);
                resolve();
              }
            }
          )
          .end(image.buffer);
      })
  );

  await Promise.all(uploadPromises);

  // Create new product
  const product = await Product.create({
    name,
    description,
    price,
    targetShapes,
    type,
    stock,
    listedBy: req.user.id,
    imageGallery,
    imageGalleryIds
  });

  res.status(201).json({
    success: true,
    message: "Product listed successfully.",
    product
  });
});

// Admin Listed Products
exports.getListedProducts = async (req, res) => {
  try {
    // Ensure the user is an admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    // Fetch products listed by the logged-in admin
    const products = await Product.find({ listedBy: req.user._id }).populate(
      "listedBy",
      "name email"
    );
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//Delete Product by Admin
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    // Delete the associated images from Cloudinary
    if (product.imageGalleryIds && product.imageGalleryIds.length > 0) {
      for (const publicId of product.imageGalleryIds) {
        await cloudinary.uploader.destroy(publicId);
      }
    }
    // Delete the product package itself
    await product.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Get Product by ID
exports.getProductById = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return next(new ErrorHandler("product not found", 404));
    }
    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
});

// Update Product by Admin
exports.updateProduct = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, stock, deletedImages } =
      req.body;
    // Find the product by ID
    const product = await Product.findById(id);
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
    // Handle image deletions
    if (deletedImages && deletedImages.length > 0) {
      try {
        // Delete images from Cloudinary
        for (const publicId of deletedImages) {
          await cloudinary.uploader.destroy(publicId);
        }

        // Update image arrays
        product.imageGallery = product.imageGallery.filter(
          (url, index) =>
            !deletedImages.includes(product.imageGalleryIds[index])
        );
        product.imageGalleryIds = product.imageGalleryIds.filter(
          (id) => !deletedImages.includes(id)
        );
      } catch (error) {
        return next(new ErrorHandler("Error deleting images", 500));
      }
    }
    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      try {
        if (product.imageGallery.length + req.files.length > 5) {
          return next(new ErrorHandler("Maximum 5 images allowed", 400));
        }

        const uploadPromises = req.files.map(
          (file) =>
            new Promise((resolve, reject) => {
              cloudinary.uploader
                .upload_stream(
                  { folder: "products/watch-gallery", resource_type: "auto" },
                  (error, result) => {
                    if (error) reject(error);
                    else
                      resolve({
                        url: result.secure_url,
                        publicId: result.public_id
                      });
                  }
                )
                .end(file.buffer);
            })
        );

        const uploadedImages = await Promise.all(uploadPromises);

        product.imageGallery.push(...uploadedImages.map((img) => img.url));
        product.imageGalleryIds.push(
          ...uploadedImages.map((img) => img.publicId)
        );
      } catch (error) {
        return next(new ErrorHandler("Error uploading images", 500));
      }
    }

    // Update basic fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (category) product.category = category;
    if (stock) product.stock = stock;

    product.updatedAt = Date.now();
    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
});

//Search Suggesstions ('/search/suggestions')
exports.getSuggesstions = asyncHandler(async (req, res) => {
  const query = req.query.query;
  try {
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } }
      ]
    }).limit(5); // Limit to 5 results
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Sample Controller for Product Search
exports.searchProducts = async (req, res) => {
  try {
    const { query, category, sort, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (query) filter.name = { $regex: query, $options: "i" };
    if (category) filter.category = category;

    let sortOption = {};
    if (sort === "priceLowToHigh") sortOption.price = 1;
    else if (sort === "priceHighToLow") sortOption.price = -1;
    else if (sort === "newest") sortOption.createdAt = -1;

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({ products, totalPages });
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};
