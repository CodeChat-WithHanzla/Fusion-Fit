const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },

    // Change this to match your body shape targeting
    targetShapes: {
      type: [String],
      enum: ["hourglass", "pear", "apple", "rectangle", "inverted triangle"],
      required: true
    },

    type: {
      type: String,
      enum: ["dress", "top", "bottom", "accessory", "outerwear"],
      required: true
    },

    stock: { type: Number, required: true },

    imageGallery: {
      type: [String],
      validate: [arrayLimit, "You can upload a maximum of 5 images"]
    },

    imageGalleryIds: {
      type: [String]
    },

    listedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

function arrayLimit(val) {
  return val.length <= 5;
}

module.exports = mongoose.model("Product", productSchema);
