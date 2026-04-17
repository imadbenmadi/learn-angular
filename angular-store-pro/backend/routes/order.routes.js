const express = require("express");
const { body, validationResult } = require("express-validator");
const Order = require("../models/Order");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

const router = express.Router();

/**
 * Get all orders (admin only)
 */
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;
        const status = req.query.status;

        let query = {};
        if (status) {
            query.status = status;
        }

        const total = await Order.countDocuments(query);
        const orders = await Order.find(query)
            .limit(limit)
            .skip(offset)
            .populate("userId", "email firstName lastName")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            message: "Orders retrieved successfully",
            data: orders,
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
            message: "Error retrieving orders",
            statusCode: 500,
        });
    }
});

/**
 * Get user's orders
 */
router.get("/user", authMiddleware, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;

        const total = await Order.countDocuments({ userId: req.userId });
        const orders = await Order.find({ userId: req.userId })
            .limit(limit)
            .skip(offset)
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            message: "User orders retrieved successfully",
            data: orders,
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
            message: "Error retrieving user orders",
            statusCode: 500,
        });
    }
});

/**
 * Get order by ID
 */
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
                statusCode: 404,
            });
        }

        // Check authorization
        if (
            order.userId.toString() !== req.userId &&
            req.userRole !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied",
                statusCode: 403,
            });
        }

        res.json({
            success: true,
            message: "Order retrieved successfully",
            data: order,
            statusCode: 200,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving order",
            statusCode: 500,
        });
    }
});

/**
 * Create order
 */
router.post(
    "/",
    authMiddleware,
    [
        body("items").isArray(),
        body("totalAmount").isFloat({ min: 0 }),
        body("shippingAddress").notEmpty(),
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

            const order = new Order({
                ...req.body,
                userId: req.userId,
            });

            await order.save();

            res.status(201).json({
                success: true,
                message: "Order created successfully",
                data: order,
                statusCode: 201,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error creating order",
                statusCode: 500,
            });
        }
    },
);

/**
 * Update order status (admin only)
 */
router.patch(
    "/:id/status",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {
        try {
            const order = await Order.findByIdAndUpdate(
                req.params.id,
                { status: req.body.status },
                { new: true },
            );

            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: "Order not found",
                    statusCode: 404,
                });
            }

            res.json({
                success: true,
                message: "Order status updated successfully",
                data: order,
                statusCode: 200,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error updating order status",
                statusCode: 500,
            });
        }
    },
);

/**
 * Cancel order
 */
router.patch("/:id/cancel", authMiddleware, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
                statusCode: 404,
            });
        }

        // Check authorization
        if (
            order.userId.toString() !== req.userId &&
            req.userRole !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied",
                statusCode: 403,
            });
        }

        order.status = "cancelled";
        await order.save();

        res.json({
            success: true,
            message: "Order cancelled successfully",
            data: order,
            statusCode: 200,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error cancelling order",
            statusCode: 500,
        });
    }
});

module.exports = router;
