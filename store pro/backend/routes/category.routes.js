const express = require("express");
const Category = require("../models/Category");
const Product = require("../models/Product");
const {
    authMiddleware,
    optionalAuthMiddleware,
    adminMiddleware,
} = require("../middleware/auth");

const router = express.Router();

/**
 * Get all categories
 */
router.get("/", optionalAuthMiddleware, async (req, res) => {
    try {
        const includeInactive =
            req.query.includeInactive === "true" ||
            req.query.includeInactive === "1";
        const isAdmin = req.userRole === "admin";

        const filter = includeInactive && isAdmin ? {} : { isActive: true };

        const categories = await Category.find(filter).sort({ name: 1 });
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
        const payload = {
            ...req.body,
            name: req.body?.name
                ? String(req.body.name).trim()
                : req.body?.name,
            slug: req.body?.slug
                ? String(req.body.slug).trim().toLowerCase()
                : req.body?.slug,
        };

        const category = new Category(payload);
        await category.save();

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category,
            statusCode: 201,
        });
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Category name or slug already exists",
                statusCode: 400,
            });
        }
        res.status(500).json({
            success: false,
            message: "Error creating category",
            statusCode: 500,
        });
    }
});

/**
 * Update category (admin only)
 */
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const updates = {};

        if (req.body?.name !== undefined) {
            updates.name = String(req.body.name).trim();
        }
        if (req.body?.slug !== undefined) {
            updates.slug = String(req.body.slug).trim().toLowerCase();
        }
        if (req.body?.description !== undefined) {
            updates.description = req.body.description;
        }
        if (req.body?.image !== undefined) {
            updates.image = req.body.image;
        }
        if (req.body?.isActive !== undefined) {
            updates.isActive = req.body.isActive;
        }

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            updates,
            {
                new: true,
                runValidators: true,
            },
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
                statusCode: 404,
            });
        }

        res.json({
            success: true,
            message: "Category updated successfully",
            data: category,
            statusCode: 200,
        });
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Category name or slug already exists",
                statusCode: 400,
            });
        }
        res.status(500).json({
            success: false,
            message: "Error updating category",
            statusCode: 500,
        });
    }
});

/**
 * Delete category (admin only)
 *
 * If products still reference this category, we deactivate it instead of deleting.
 */
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const id = req.params.id;

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
                statusCode: 404,
            });
        }

        const referencedCount = await Product.countDocuments({ category: id });

        if (referencedCount > 0) {
            await Category.findByIdAndUpdate(
                id,
                { isActive: false },
                { new: true },
            );
            return res.json({
                success: true,
                message:
                    "Category is referenced by products and was archived (deactivated) instead of deleted",
                data: {
                    action: "archived",
                    referencedProducts: referencedCount,
                },
                statusCode: 200,
            });
        }

        await Category.findByIdAndDelete(id);
        res.json({
            success: true,
            message: "Category deleted successfully",
            data: { action: "deleted" },
            statusCode: 200,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting category",
            statusCode: 500,
        });
    }
});

module.exports = router;
