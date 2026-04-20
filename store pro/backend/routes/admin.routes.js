const express = require("express");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Order = require("../models/Order");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

const router = express.Router();

/**
 * Admin stats (admin only)
 *
 * Demonstrates MongoDB aggregation for learning:
 * - counts
 * - group by status
 * - sum revenue for delivered + completed orders
 */
router.get("/stats", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const [
            productTotal,
            productActive,
            categoryTotal,
            categoryActive,
            orderTotal,
            orderCountsByStatus,
            revenueAgg,
        ] = await Promise.all([
            Product.countDocuments({}),
            Product.countDocuments({ isActive: true }),
            Category.countDocuments({}),
            Category.countDocuments({ isActive: true }),
            Order.countDocuments({}),
            Order.aggregate([
                { $group: { _id: "$status", count: { $sum: 1 } } },
            ]),
            Order.aggregate([
                {
                    $match: {
                        status: "delivered",
                        paymentStatus: "completed",
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: "$totalAmount" },
                    },
                },
            ]),
        ]);

        const byStatus = {};
        for (const row of orderCountsByStatus) {
            byStatus[row._id] = row.count;
        }

        const revenue = revenueAgg?.[0]?.totalRevenue || 0;

        res.json({
            success: true,
            message: "Admin stats retrieved successfully",
            data: {
                products: {
                    total: productTotal,
                    active: productActive,
                    inactive: productTotal - productActive,
                },
                categories: {
                    total: categoryTotal,
                    active: categoryActive,
                    inactive: categoryTotal - categoryActive,
                },
                orders: {
                    total: orderTotal,
                    byStatus,
                    revenue,
                },
            },
            statusCode: 200,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving admin stats",
            statusCode: 500,
        });
    }
});

module.exports = router;
