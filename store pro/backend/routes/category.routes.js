const express = require("express");
const Category = require("../models/Category");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

const router = express.Router();

/**
 * Get all categories
 */
router.get("/", async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true });
        res.json({
            success: true,
            message: "Categories retrieved successfully",
            data: categories,
            statusCode: 200,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving categories",
            statusCode: 500,
        });
    }
});

/**
 * Create category (admin only)
 */
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const category = new Category(req.body);
        await category.save();

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category,
            statusCode: 201,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating category",
            statusCode: 500,
        });
    }
});

module.exports = router;
