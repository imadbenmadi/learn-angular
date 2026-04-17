const express = require("express");
const { body, validationResult } = require("express-validator");
const Product = require("../models/Product");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

const router = express.Router();

/**
 * Get all products with pagination and filtering
 */
router.get("/", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;
        const category = req.query.category;
        const search = req.query.search;

        let query = { isActive: true };

        if (category) {
            query.category = category;
        }

        if (search) {
            query.$text = { $search: search };
        }

        const total = await Product.countDocuments(query);
        const products = await Product.find(query)
            .limit(limit)
            .skip(offset)
            .populate("category", "name slug")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            message: "Products retrieved successfully",
            data: products,
            pagination: {
                total,
                limit,
                offset,
                pages: Math.ceil(total / limit),
                currentPage: Math.floor(offset / limit) + 1,
            },
            statusCode: 200,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving products",
            statusCode: 500,
        });
    }
});

/**
 * Get product by ID
 */
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate(
            "category",
        );
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
                statusCode: 404,
            });
        }

        res.json({
            success: true,
            message: "Product retrieved successfully",
            data: product,
            statusCode: 200,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving product",
            statusCode: 500,
        });
    }
});

/**
 * Create product (admin only)
 */
router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    [
        body("name").trim().notEmpty(),
        body("description").trim().notEmpty(),
        body("price").isFloat({ min: 0 }),
        body("category").notEmpty(),
        body("sku").trim().notEmpty(),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: "Validation error",
                    errors: errors.array(),
                    statusCode: 400,
                });
            }

            const product = new Product(req.body);
            await product.save();

            res.status(201).json({
                success: true,
                message: "Product created successfully",
                data: product,
                statusCode: 201,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error creating product",
                statusCode: 500,
            });
        }
    },
);

/**
 * Update product (admin only)
 */
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true },
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
                statusCode: 404,
            });
        }

        res.json({
            success: true,
            message: "Product updated successfully",
            data: product,
            statusCode: 200,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating product",
            statusCode: 500,
        });
    }
});

/**
 * Delete product (admin only)
 */
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
                statusCode: 404,
            });
        }

        res.json({
            success: true,
            message: "Product deleted successfully",
            statusCode: 200,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting product",
            statusCode: 500,
        });
    }
});

module.exports = router;
