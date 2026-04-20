const express = require("express");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const { authMiddleware } = require("../middleware/auth");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "secret-key";

/**
 * Register new user
 */
router.post(
    "/register",
    [
        body("email").isEmail().normalizeEmail(),
        body("firstName").trim().notEmpty(),
        body("lastName").trim().notEmpty(),
        body("password").isLength({ min: 6 }),
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

            const { email, firstName, lastName, password } = req.body;

            // Check if user exists
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({
                    success: false,
                    message: "User already exists",
                    statusCode: 400,
                });
            }

            // Create new user
            user = new User({ email, firstName, lastName, password });
            await user.save();

            // Generate token
            const token = jwt.sign(
                { id: user._id, role: user.role },
                JWT_SECRET,
                { expiresIn: "7d" },
            );

            res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: {
                    token,
                    user: {
                        _id: user._id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role,
                    },
                },
                statusCode: 201,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Registration error",
                statusCode: 500,
            });
        }
    },
);

/**
 * Login user
 */
router.post(
    "/login",
    [body("email").isEmail().normalizeEmail(), body("password").notEmpty()],
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

            const { email, password } = req.body;

            // Find user
            const user = await User.findOne({ email }).select("+password");
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials",
                    statusCode: 401,
                });
            }

            // Check password
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials",
                    statusCode: 401,
                });
            }

            // Generate token
            const token = jwt.sign(
                { id: user._id, role: user.role },
                JWT_SECRET,
                { expiresIn: "7d" },
            );

            res.json({
                success: true,
                message: "Login successful",
                data: {
                    token,
                    user: {
                        _id: user._id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role,
                    },
                },
                statusCode: 200,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Login error",
                statusCode: 500,
            });
        }
    },
);

/**
 * Verify token
 */
router.post("/verify", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                statusCode: 404,
            });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
            expiresIn: "7d",
        });

        res.json({
            success: true,
            message: "Token verified",
            data: {
                token,
                user: {
                    _id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                },
            },
            statusCode: 200,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Verification error",
            statusCode: 500,
        });
    }
});

/**
 * Update profile (authenticated)
 */
router.put(
    "/profile",
    authMiddleware,
    [
        body("firstName").optional().trim().notEmpty(),
        body("lastName").optional().trim().notEmpty(),
        body("phone").optional({ nullable: true }).trim(),
        body("avatar").optional({ nullable: true }).trim(),
        body("addresses").optional({ nullable: true }).isArray(),
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

            const updates = {};
            if (req.body.firstName !== undefined)
                updates.firstName = req.body.firstName;
            if (req.body.lastName !== undefined)
                updates.lastName = req.body.lastName;
            if (req.body.phone !== undefined) updates.phone = req.body.phone;
            if (req.body.avatar !== undefined) updates.avatar = req.body.avatar;
            if (req.body.addresses !== undefined)
                updates.addresses = req.body.addresses;

            const user = await User.findByIdAndUpdate(req.userId, updates, {
                new: true,
                runValidators: true,
            });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found",
                    statusCode: 404,
                });
            }

            const token = jwt.sign(
                { id: user._id, role: user.role },
                JWT_SECRET,
                {
                    expiresIn: "7d",
                },
            );

            res.json({
                success: true,
                message: "Profile updated successfully",
                data: {
                    token,
                    user: {
                        _id: user._id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        phone: user.phone,
                        avatar: user.avatar,
                        addresses: user.addresses,
                        role: user.role,
                        isActive: user.isActive,
                    },
                },
                statusCode: 200,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Profile update error",
                statusCode: 500,
            });
        }
    },
);

module.exports = router;
