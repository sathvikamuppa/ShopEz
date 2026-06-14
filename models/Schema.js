import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String },
    password: { type: String },
    email: { type: String },
    usertype: { type: String }
});

const adminSchema = new mongoose.Schema({
    banner: { type: String },
    categories: { type: Array }
});

const productSchema = new mongoose.Schema({
    title: { type: String },
    description: { type: String },
    imageUrl: { type: String },
    carousel: { type: Array },
    sizes: { type: Array },
    category: { type: String },
    gender: { type: String },
    price: { type: Number },
    discount: { type: Number }
});

const orderSchema = new mongoose.Schema({
    userId: { type: String },
    name: { type: String },
    email: { type: String },
    mobile: { type: String },
    address: { type: String },
    pincode: { type: String },
    title: { type: String },
    description: { type: String },
    imageUrl: { type: String },
    size: { type: String },
    quantity: { type: Number },
    price: { type: Number },
    discount: { type: Number },
    paymentMethod: { type: String },
    orderDate: { type: String },
    deliveryDate: { type: String },
    orderStatus: { type: String, default: 'order placed' }
});

const cartSchema = new mongoose.Schema({
    userId: { type: String },
    title: { type: String },
    description: { type: String },
    imageUrl: { type: String },
    size: { type: String },
    quantity: { type: Number },
    price: { type: Number },
    discount: { type: Number }
});

// ✅ FIXED: prevents OverwriteModelError
export const User =
    mongoose.models.users || mongoose.model('users', userSchema);

export const Admin =
    mongoose.models.admin || mongoose.model('admin', adminSchema);

export const Product =
    mongoose.models.products || mongoose.model('products', productSchema);

export const Orders =
    mongoose.models.orders || mongoose.model('orders', orderSchema);

export const Cart =
    mongoose.models.cart || mongoose.model('cart', cartSchema);