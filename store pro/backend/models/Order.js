const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            unique: true,
            default: () => "ORD-" + Date.now(),
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
        },
        items: [
            {
                productId: mongoose.Schema.Types.ObjectId,
                productName: String,
                price: Number,
                quantity: { type: Number, min: 1 },
                totalPrice: Number,
            },
        ],
        totalAmount: {
            type: Number,
            required: [true, "Total amount is required"],
        },
        shippingAddress: {
            firstName: String,
            lastName: String,
            email: String,
            phone: String,
            street: String,
            city: String,
            state: String,
            postalCode: String,
            country: String,
        },
        billingAddress: {
            firstName: String,
            lastName: String,
            email: String,
            phone: String,
            street: String,
            city: String,
            state: String,
            postalCode: String,
            country: String,
        },
        status: {
            type: String,
            enum: [
                "pending",
                "processing",
                "shipped",
                "delivered",
                "cancelled",
                "returned",
            ],
            default: "pending",
        },
        paymentMethod: {
            type: String,
            enum: ["credit_card", "debit_card", "paypal", "bank_transfer"],
            default: "credit_card",
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "completed", "failed", "refunded"],
            default: "pending",
        },
        notes: {
            type: String,
            default: null,
        },
        trackingNumber: {
            type: String,
            default: null,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
