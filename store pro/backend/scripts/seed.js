/* eslint-disable no-console */
const mongoose = require("mongoose");
require("dotenv").config({
    path: require("path").join(__dirname, "..", ".env"),
});

const Category = require("../models/Category");
const Product = require("../models/Product");
const User = require("../models/User");

const MONGODB_URI =
    process.env.MONGODB_URI ||
    "mongodb://127.0.0.1:27017/store_pro?directConnection=true";

function placeholderImage(w, h, text) {
    return `/api/images/placeholder?w=${w}&h=${h}&text=${encodeURIComponent(
        text,
    )}`;
}

const categoriesSeed = [
    {
        name: "Electronics",
        slug: "electronics",
        description: "Phones, laptops, audio and accessories.",
        image: placeholderImage(600, 300, "Electronics"),
        isActive: true,
    },
    {
        name: "Home & Kitchen",
        slug: "home-kitchen",
        description: "Essentials to upgrade your home.",
        image: placeholderImage(600, 300, "Home & Kitchen"),
        isActive: true,
    },
    {
        name: "Fashion",
        slug: "fashion",
        description: "Everyday style for everyone.",
        image: placeholderImage(600, 300, "Fashion"),
        isActive: true,
    },
];

const productsSeed = [
    {
        sku: "ELEC-HEADPHONES-001",
        name: "Wireless Headphones",
        description:
            "Comfortable wireless headphones with clear sound and long battery life.",
        price: 79.99,
        salePrice: 59.99,
        categorySlug: "electronics",
        image: placeholderImage(600, 600, "Wireless Headphones"),
        images: [
            placeholderImage(600, 600, "Headphones 1"),
            placeholderImage(600, 600, "Headphones 2"),
        ],
        stock: 25,
        rating: 4.5,
        reviews: 132,
        specifications: {
            battery: "30 hours",
            connectivity: "Bluetooth 5.2",
            microphone: "Built-in",
        },
        isActive: true,
    },
    {
        sku: "ELEC-LAPTOP-001",
        name: 'Ultrabook Laptop 14"',
        description:
            "A fast, lightweight laptop for work and learning with a sharp display.",
        price: 899.0,
        categorySlug: "electronics",
        image: placeholderImage(600, 600, 'Ultrabook Laptop 14"'),
        stock: 12,
        rating: 4.2,
        reviews: 58,
        specifications: {
            cpu: "Quad-core",
            ram: "16GB",
            storage: "512GB SSD",
        },
        isActive: true,
    },
    {
        sku: "HOME-COFFEE-001",
        name: "Coffee Maker",
        description:
            "Brew great coffee in minutes with simple controls and easy cleanup.",
        price: 49.99,
        categorySlug: "home-kitchen",
        image: placeholderImage(600, 600, "Coffee Maker"),
        stock: 40,
        rating: 4.1,
        reviews: 210,
        specifications: {
            capacity: "1.2L",
            features: "Auto shut-off",
        },
        isActive: true,
    },
    {
        sku: "HOME-BLENDER-001",
        name: "Kitchen Blender",
        description:
            "A powerful blender for smoothies, sauces, and everyday recipes.",
        price: 69.99,
        salePrice: 64.99,
        categorySlug: "home-kitchen",
        image: placeholderImage(600, 600, "Kitchen Blender"),
        stock: 18,
        rating: 4.0,
        reviews: 87,
        specifications: {
            power: "600W",
            jar: "1.5L",
        },
        isActive: true,
    },
    {
        sku: "FASH-TSHIRT-001",
        name: "Classic T-Shirt",
        description:
            "Soft and durable cotton t-shirt that fits well and looks great.",
        price: 19.99,
        categorySlug: "fashion",
        image: placeholderImage(600, 600, "Classic T-Shirt"),
        stock: 100,
        rating: 4.6,
        reviews: 310,
        specifications: {
            material: "100% Cotton",
            fit: "Regular",
        },
        isActive: true,
    },
    {
        sku: "FASH-SNEAKERS-001",
        name: "Everyday Sneakers",
        description:
            "Comfortable sneakers designed for daily wear and long walks.",
        price: 59.99,
        categorySlug: "fashion",
        image: placeholderImage(600, 600, "Everyday Sneakers"),
        stock: 35,
        rating: 4.3,
        reviews: 144,
        specifications: {
            sole: "Rubber",
            style: "Low-top",
        },
        isActive: true,
    },
];

const usersSeed = [
    {
        email: "admin@store.com",
        firstName: "Admin",
        lastName: "User",
        password: "admin123",
        role: "admin",
        isActive: true,
    },
    {
        email: "customer@store.com",
        firstName: "Customer",
        lastName: "User",
        password: "customer123",
        role: "customer",
        isActive: true,
    },
];

async function seed() {
    console.log("\n🌱 Seeding database...");
    console.log(`🗄️  MONGODB_URI: ${MONGODB_URI}`);

    await mongoose.connect(MONGODB_URI);

    // Upsert categories
    const categoryBySlug = new Map();
    for (const category of categoriesSeed) {
        const doc = await Category.findOneAndUpdate(
            { slug: category.slug },
            { $set: category },
            { new: true, upsert: true },
        );
        categoryBySlug.set(doc.slug, doc);
    }

    // Upsert products by SKU
    for (const p of productsSeed) {
        const categoryDoc = categoryBySlug.get(p.categorySlug);
        if (!categoryDoc) {
            console.warn(`⚠️  Missing category for product SKU ${p.sku}`);
            // Skip this product
            continue;
        }

        const productDoc = {
            name: p.name,
            description: p.description,
            price: p.price,
            salePrice: p.salePrice ?? null,
            category: categoryDoc._id,
            image: p.image,
            images: p.images ?? [],
            stock: p.stock,
            sku: p.sku,
            rating: p.rating ?? 0,
            reviews: p.reviews ?? 0,
            specifications: p.specifications ?? {},
            isActive: true,
        };

        await Product.findOneAndUpdate(
            { sku: p.sku },
            { $set: productDoc },
            { new: true, upsert: true },
        );
    }

    // Create demo users if missing (avoid resetting passwords on existing accounts)
    for (const u of usersSeed) {
        const existing = await User.findOne({ email: u.email }).select("_id");
        if (!existing) {
            const user = new User(u);
            await user.save();
        }
    }

    const categoriesCount = await Category.countDocuments();
    const productsCount = await Product.countDocuments();
    const usersCount = await User.countDocuments();

    console.log(
        `✅ Seed complete: ${categoriesCount} categories, ${productsCount} products, ${usersCount} users\n`,
    );

    await mongoose.disconnect();
}

seed()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error("❌ Seed failed:", err);
        process.exit(1);
    });
