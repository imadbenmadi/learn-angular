const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided",
                statusCode: 401,
            });
        }

        jwt.verify(
            token,
            process.env.JWT_SECRET || "secret-key",
            (err, decoded) => {
                if (err) {
                    return res.status(401).json({
                        success: false,
                        message: "Invalid or expired token",
                        statusCode: 401,
                    });
                }

                req.userId = decoded.id;
                req.userRole = decoded.role;
                next();
            },
        );
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Authentication error",
            statusCode: 500,
        });
    }
};

const adminMiddleware = (req, res, next) => {
    if (req.userRole !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Admin role required.",
            statusCode: 403,
        });
    }
    next();
};

module.exports = { authMiddleware, adminMiddleware };
