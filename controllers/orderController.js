import { Orders, Cart } from '../models/Schema.js';

// ======================================
// ✅ FETCH ORDERS
// ======================================
export const fetchOrders = async (req, res) => {
  try {
    let orders;

    if (req.user.usertype === "Admin") {
      orders = await Orders.find();
    } else {
      orders = await Orders.find({ userId: req.user._id });
    }

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error occurred while fetching orders" });
  }
};

// ======================================
// ✅ BUY SINGLE PRODUCT (FIXED IMAGE)
// ======================================
export const buyProduct = async (req, res) => {
  const {
    name,
    email,
    mobile,
    address,
    pincode,
    title,
    description,
    mainImg,
    imageUrl,
    image,
    size,
    quantity,
    price,
    discount,
    paymentMethod,
    orderDate
  } = req.body;

  try {
    const newOrder = new Orders({
      userId: req.user._id,

      name,
      email,
      mobile,
      address,
      pincode,

      title,
      description,

      // ✅ UNIFIED IMAGE FIELD (MAIN FIX)
      imageUrl: mainImg || imageUrl || image || "",

      size,
      quantity,
      price,
      discount,
      paymentMethod,
      orderDate,

      orderStatus: "Processing"
    });

    await newOrder.save();

    res.json({ message: "Order placed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error occurred while placing order" });
  }
};

// ======================================
// ✅ CANCEL ORDER
// ======================================
export const cancelOrder = async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ message: "Order ID is required" });
  }

  try {
    const order = await Orders.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = "Cancelled";
    await order.save();

    await Cart.deleteMany({ order: orderId });

    res.json({ message: "Order cancelled successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ======================================
// ✅ UPDATE ORDER STATUS
// ======================================
export const updateOrderStatus = async (req, res) => {
  const { id, updateStatus } = req.body;

  try {
    const order = await Orders.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = updateStatus;
    await order.save();

    res.json({ message: "Order status updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error occurred while updating status" });
  }
};

// ======================================
// ✅ PLACE CART ORDER (FIXED IMAGE)
// ======================================
export const placeCartOrder = async (req, res) => {
  const { name, mobile, email, address, pincode, paymentMethod, orderDate } = req.body;

  try {
    const cartItems = await Cart.find({ userId: req.user._id });

    await Promise.all(
      cartItems.map(async (item) => {
        const newOrder = new Orders({
          userId: req.user._id,

          name,
          email,
          mobile,
          address,
          pincode,

          title: item.title,
          description: item.description,

          // ✅ UNIFIED IMAGE FIELD
          imageUrl: item.mainImg || item.imageUrl || item.image || "",

          size: item.size,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount,

          paymentMethod,
          orderDate,

          orderStatus: "Processing"
        });

        await newOrder.save();
        await Cart.deleteOne({ _id: item._id });
      })
    );

    res.json({ message: "Cart order placed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error occurred while placing cart order" });
  }
};