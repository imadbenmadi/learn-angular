/* ============================================
   PRODUCT MODEL
   ============================================ */
export interface Product {
    _id?: string;
    id?: string;
    name: string;
    description: string;
    price: number;
    salePrice?: number;
    category: string;
    image: string;
    images?: string[];
    stock: number;
    rating?: number;
    reviews?: number;
    sku: string;
    specifications?: Record<string, string>;
    createdAt?: Date;
    updatedAt?: Date;
}

/* ============================================
   CART MODEL
   ============================================ */
export interface CartItem {
    product: Product;
    quantity: number;
    totalPrice: number;
}

export interface Cart {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
}

/* ============================================
   ORDER MODEL
   ============================================ */
export interface OrderItem {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    totalPrice: number;
}

export interface Order {
    _id?: string;
    orderId?: string;
    userId: string;
    items: OrderItem[];
    totalAmount: number;
    shippingAddress: Address;
    billingAddress?: Address;
    status: OrderStatus;
    paymentMethod: string;
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export enum OrderStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    SHIPPED = "shipped",
    DELIVERED = "delivered",
    CANCELLED = "cancelled",
    RETURNED = "returned",
}

/* ============================================
   USER MODEL
   ============================================ */
export interface User {
    _id?: string;
    id?: string;
    email: string;
    firstName: string;
    lastName: string;
    password?: string;
    phone?: string;
    avatar?: string;
    addresses?: Address[];
    role: UserRole;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export enum UserRole {
    CUSTOMER = "customer",
    ADMIN = "admin",
    MANAGER = "manager",
}

/* ============================================
   ADDRESS MODEL
   ============================================ */
export interface Address {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault?: boolean;
}

/* ============================================
   CATEGORY MODEL
   ============================================ */
export interface Category {
    _id?: string;
    id?: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

/* ============================================
   API RESPONSE MODELS
   ============================================ */
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    errors?: string[];
    statusCode: number;
}

export interface PaginatedResponse<T> {
    success: boolean;
    message: string;
    data: T[];
    pagination: {
        total: number;
        limit: number;
        offset: number;
        pages: number;
        currentPage: number;
    };
    statusCode: number;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    confirmPassword: string;
}
