const express = require("express");
const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Order = require("../models/Order");
const {
    authMiddleware,
    optionalAuthMiddleware,
    adminMiddleware,
} = require("../middleware/auth");

const router = express.Router();

/**
 * Get all products with pagination and filtering
 */
router.get("/", optionalAuthMiddleware, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;
        const category = req.query.category;
        const search = req.query.search;
        const includeInactive =
            req.query.includeInactive === "true" ||
            req.query.includeInactive === "1";
        const isAdmin = req.userRole === "admin";

        let query = {};
        if (!(includeInactive && isAdmin)) {
            query.isActive = true;
        }

        if (category) {
            // Accept either category ObjectId or category slug
            if (mongoose.Types.ObjectId.isValid(category)) {
                if (!(includeInactive && isAdmin)) {
                    const categoryDoc = await Category.findOne({
                        _id: category,
                        isActive: true,
                    }).select("_id");

                    // If category isn't active (or doesn't exist), force empty results
                    query.category = categoryDoc ? categoryDoc._id : null;
                } else {
                    query.category = category;
                }
            } else {
                const categoryQuery = { slug: category };
                if (!(includeInactive && isAdmin)) {
                    categoryQuery.isActive = true;
                }

                const categoryDoc =
                    await Category.findOne(categoryQuery).select("_id");

                // If slug doesn't exist, force empty results (rather than returning all)
                query.category = categoryDoc ? categoryDoc._id : null;
            }
        } else if (!(includeInactive && isAdmin)) {
            // Hide products that belong to inactive categories for non-admin usage
            const activeCategoryDocs = await Category.find({ isActive: true })
                .select("_id")
                .lean();
            const activeCategoryIds = activeCategoryDocs.map((c) => c._id);
            query.category = { $in: activeCategoryIds };
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
router.get("/:id", optionalAuthMiddleware, async (req, res) => {
    try {
        const includeInactive =
            req.query.includeInactive === "true" ||
            req.query.includeInactive === "1";
        const isAdmin = req.userRole === "admin";

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

        // For non-admin users, only expose active products in active categories
        if (!(includeInactive && isAdmin)) {
            if (product.isActive !== true) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found",
                    statusCode: 404,
                });
            }

            const categoryDoc = product.category;
            if (
                !categoryDoc ||
                (typeof categoryDoc === "object" &&
                    categoryDoc.isActive === false)
            ) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found",
                    statusCode: 404,
                });
            }
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
        const id = req.params.id;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
                statusCode: 404,
            });
        }

        // If the product is referenced by any order, archive it instead of deleting.
        const referencedOrders = await Order.countDocuments({
            "items.productId": product._id,
        });

        if (referencedOrders > 0) {
            await Product.findByIdAndUpdate(
                id,
                { isActive: false },
                { new: true },
            );

            return res.json({
                success: true,
                message:
                    "Product is referenced by orders and was archived (deactivated) instead of deleted",
                data: {
                    action: "archived",
                    referencedOrders,
                },
                statusCode: 200,
            });
        }

        await Product.findByIdAndDelete(id);

        res.json({
            success: true,
            message: "Product deleted successfully",
            data: { action: "deleted" },
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
