const express = require("express");

const router = express.Router();

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function escapeXml(unsafe) {
    return String(unsafe)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

/**
 * Simple on-the-fly placeholder image generator.
 * GET /api/images/placeholder?w=600&h=600&text=Wireless%20Headphones
 */
router.get("/placeholder", (req, res) => {
    const wRaw = parseInt(String(req.query.w ?? ""), 10);
    const hRaw = parseInt(String(req.query.h ?? ""), 10);

    const width = clamp(Number.isFinite(wRaw) ? wRaw : 600, 50, 2000);
    const height = clamp(Number.isFinite(hRaw) ? hRaw : width, 50, 2000);

    const textRaw =
        typeof req.query.text === "string" ? req.query.text : "No Image";
    const text = escapeXml(textRaw).slice(0, 80);

    const fontSize = clamp(Math.floor(Math.min(width, height) / 10), 14, 48);

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${text}">
  <rect width="100%" height="100%" fill="#f3f4f6" />
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#6b7280" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}">${text}</text>
</svg>`;

    res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.status(200).send(svg);
});

module.exports = router;
