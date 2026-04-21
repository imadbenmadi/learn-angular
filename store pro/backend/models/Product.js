const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Product description is required"],
        },
        price: {
            type: Number,
            required: [true, "Product price is required"],
            min: [0, "Price cannot be negative"],
        },
        salePrice: {
            type: Number,
            default: null,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Product category is required"],
        },
        image: {
            type: String,
            required: [true, "Product image is required"],
        },
        images: [
            {
                type: String,
            },
        ],
        stock: {
            type: Number,
            required: [true, "Product stock is required"],
            default: 0,
        },
        sku: { // Stock Keeping Unit
            type: String,
            required: [true, "Product SKU is required"],
            unique: true,
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        reviews: {
            type: Number,
            default: 0,
        },
        specifications: {
            type: Map,
            of: String,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true },
);

// Index for search optimization
productSchema.index({ name: "text", description: "text" });
productSchema.index({ category: 1 });
productSchema.index({ sku: 1 });

module.exports = mongoose.model("Product", productSchema);
