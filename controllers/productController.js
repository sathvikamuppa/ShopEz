import { Product, Admin, Orders } from '../models/Schema.js';

// ================== Fetch Products ==================
export const fetchProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.log("FETCH PRODUCTS ERROR:", err);
    res.status(500).json({ message: 'Error occurred', error: err.message });
  }
};

// ================== Fetch Product Details ==================
export const fetchProductDetails = async (req, res) => {
  const id = req.params.id;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      ...product._doc,
      imageUrl: product.imageUrl || product.mainImg
    });

  } catch (err) {
    console.log("FETCH PRODUCT ERROR:", err);
    res.status(500).json({
      message: "Error occurred",
      error: err.message
    });
  }
};

// ================== Fetch Categories ==================
export const fetchCategories = async (req, res) => {
  try {
    let admin = await Admin.findOne();

    if (!admin) {
      admin = new Admin({ banner: '', categories: [] });
      await admin.save();
    }

    res.json(admin.categories);

  } catch (err) {
    console.log("FETCH CATEGORIES ERROR:", err);
    res.status(500).json({ message: 'Error occurred', error: err.message });
  }
};

// ================== Add Product ==================
export const addNewProduct = async (req, res) => {
  const {
    productName,
    productDescription,
    productMainImg,
    productCarousel,
    productSizes,
    productGender,
    productCategory,
    productNewCategory,
    productPrice,
    productDiscount
  } = req.body;

  try {
    if (req.user.usertype !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    const finalCategory =
      productCategory === "new category"
        ? productNewCategory
        : productCategory;

    if (productCategory === "new category") {
      const admin = await Admin.findOne();
      admin.categories.push(productNewCategory);
      await admin.save();
    }

    const newProduct = new Product({
      title: productName,
      description: productDescription,
      imageUrl: productMainImg,
      carousel: productCarousel,
      category: finalCategory,
      sizes: productSizes,
      gender: productGender,
      price: productPrice,
      discount: productDiscount
    });

    await newProduct.save();

    res.json({ message: "Product added!!" });

  } catch (err) {
    console.log("ADD PRODUCT ERROR:", err);
    res.status(500).json({ message: 'Error occurred', error: err.message });
  }
};

// ================== Update Product ==================
export const updateProduct = async (req, res) => {
  const id = req.params.id;

  const {
    productName,
    productDescription,
    productMainImg,
    productCarousel,
    productSizes,
    productGender,
    productCategory,
    productNewCategory,
    productPrice,
    productDiscount
  } = req.body;

  try {
    if (req.user.usertype !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const finalCategory =
      productCategory === "new category"
        ? productNewCategory
        : productCategory;

    if (productCategory === "new category") {
      const admin = await Admin.findOne();
      admin.categories.push(productNewCategory);
      await admin.save();
    }

    product.title = productName;
    product.description = productDescription;
    product.imageUrl = productMainImg;
    product.carousel = productCarousel;
    product.category = finalCategory;
    product.sizes = productSizes;
    product.gender = productGender;
    product.price = productPrice;
    product.discount = productDiscount;

    await product.save();

    res.json({ message: "Product updated!!" });

  } catch (err) {
    console.log("UPDATE PRODUCT ERROR:", err);
    res.status(500).json({ message: 'Error occurred', error: err.message });
  }
};

// ================== Buy Product ==================
export const buyProduct = async (req, res) => {
  try {
    const {
      userId,
      name,
      email,
      mobile,
      address,
      pincode,
      title,
      description,
      imageUrl,
      size,
      quantity,
      price,
      discount,
      paymentMethod
    } = req.body;

    const newOrder = new Orders({
      userId,
      name,
      email,
      mobile,
      address,
      pincode,
      title,
      description,
      imageUrl,
      size,
      quantity,
      price,
      discount,
      paymentMethod,
      orderStatus: "Pending"
    });

    await newOrder.save();

    res.status(200).json({
      success: true,
      message: "Order placed successfully!",
      order: newOrder
    });

  } catch (err) {
    console.log("ORDER ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Order failed",
      error: err.message
    });
  }
};