const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');

// @desc Create new order
// @route POST /api/orders
// @access Private
const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, totalPrice } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const order = new Order({
      orderItems: orderItems.map((x) => ({
        ...x,
        product: x._id, // Frontenddan kelgan ID ni product ref ga o'tkazish
        _id: undefined  // Yangi ID yaratmaslik uchun
      })),
      user: req.user._id,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

// @desc Get logged in user orders
// @route GET /api/orders/myorders
// @access Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }); // Eng yangisi tepada turadi
  res.json(orders);
});

module.exports = { addOrderItems, getMyOrders };