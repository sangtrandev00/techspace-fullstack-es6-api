const Category = require("../models/Category");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { faker } = require("@faker-js/faker");
// const Category = require('../models/category');

exports.postOrder = async (req, res, next) => {
  const { note, paymentMethod, vatFee, shippingFee, products, user } = req.body;

  try {
    const order = new Order({
      note,
      vatFee: 10,
      shippingFee: 20,
      paymentMethod,
      products,
      user,
      status: "Waiting to Confirm",
    });

    const response = await order.save();
    // Update qty product at database (-qty);
    // products.items.forEach((product) => {

    //   const {id} =

    // })

    res.status(201).json({
      message: "Created order successfully!",
      order: response,
    });
  } catch (error) {
    if (!error) {
      const error = new Error("Failed to post order!");
      error.statusCode(422);
      return error;
    }
    next(error);
  }
};

exports.randomOrders = async (req, res, next) => {
  try {
    const products = await Product.find();

    let result = [];

    // Loop to create 20 random orders;
    for (let i = 0; i < 16; i++) {
      const randomMonth = `${Math.ceil(Math.random() * 12)}`.padStart(2, "0");
      const randomHour = `${Math.ceil(Math.random() * 12)}`.padStart(2, "0");

      const orderData = {
        note: "Keep it safe please!!!",
        vatFee: 0,
        shippingFee: 0,
        paymentMethod: "COD",
        products: {
          items: [],
          totalPrice: 0,
        },
        user: {
          email: faker.internet.email({ provider: "gmail" }),
          fullName: faker.person.fullName(),
          phone: faker.phone.number("0#########"),
          shippingAddress: faker.location.streetAddress({ useFullAddress: true }),
        },
        status: "success",
        createdAt: new Date(`2023-${randomMonth}-21T${randomHour}:19:01.014+00:00`),
        updatedAt: new Date(`2023-${randomMonth}-21T${randomHour}:19:01.014+00:00`),
      };

      // Random number products
      Array.from(new Array(2)).forEach(() => {
        const randNumber = Math.trunc(Math.random() * 12);

        const productItem = products[randNumber];

        const product = {
          prodId: productItem._id,
          qty: 2,
          price: productItem.oldPrice * (1 - productItem.discount / 100),
          name: productItem.name,
          image: productItem.thumbnail,
        };

        orderData.products.items.push(product);
      });

      const totalPrice = orderData.products.items.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
      );

      orderData.products.totalPrice = totalPrice;

      // console.log(orderData);

      const orderCreated = new Order(orderData);
      await orderCreated.save();

      result.push(orderData);
    }

    res.status(200).json({
      message: "Successfully!",
      result,
    });
  } catch (error) {
    if (!error) {
      const error = new Error("Failed to get random orderss!");
      error.statusCode(422);
      return error;
    }
    next(error);
  }
};

exports.getOrder = async (req, res, next) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);

    res.status(200).json({
      message: "Get order by id successfully!",
      order,
    });
  } catch (error) {
    if (!error) {
      const error = new Error("Failed to get order by id!");
      error.statusCode(422);
      return error;
    }
    next(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();

    res.json({
      message: "fetch all orders successfully!",
      orders,
    });
  } catch (error) {
    if (!error) {
      const error = new Error("Failed to get order by id!");
      error.statusCode(422);
      return error;
    }
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  const { status } = req.body;

  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);

    console.log(order, status);

    order.status = status;

    const newOrder = await order.save();

    res.status(200).json({
      message: "Update order status successfully!",
      orderId,
    });
  } catch (error) {
    if (!error) {
      const error = new Error("Failed to update order");
      error.statusCode(422);
      return error;
    }
    next(error);
  }
};

exports.deleteOrder = async (req, res, next) => {
  const { orderId } = req.params;
  try {
    const response = await Order.deleteOne({
      _id: orderId,
    });

    res.status(200).json({
      message: "Delete order successfully!",
      orderId: orderId,
      result: response,
    });
  } catch (error) {
    if (!error) {
      const error = new Error("Failed to delete order!");
      error.statusCode(422);
      return error;
    }
    next(error);
  }
};

exports.getInvoices = async (req, res, next) => {};
