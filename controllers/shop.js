const Category = require("../models/Category");
const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
// const Category = require('../models/category');

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    // console.log("categories: ", categories);
    res.status(200).json({
      message: "Fetch categories sucessfully!",
      categories,
    });
  } catch (error) {
    if (!error) {
      const error = new Error("Failed to fetch categories!");
      error.statusCode(422);
      return error;
    }
    next(error);
  }
};

exports.getCategory = async (req, res, next) => {
  const { categoryId } = req.params;
  try {
    const category = await Category.findById(categoryId);

    res.status(200).json({
      message: "Fetch category by id successfully!",
      category,
    });
  } catch (error) {
    if (!error) {
      const error = new Error("Failed to fetch category by id!");
      error.statusCode(422);
      return error;
    }
    next(error);
  }
};

exports.updateViews = async (req, res, next) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId);

    product.views += 1;

    const result = await product.save();

    res.status(200).json({
      message: `view of product: ${productId} increase to 1`,
      result,
    });
  } catch (error) {
    if (!error) {
      const error = new Error("Failed to fetch category by id!");
      error.statusCode(422);
      return error;
    }
    next(error);
  }
};

exports.getProducts = async (req, res, next) => {
  const { _limit, _sort, _order, _q, _min, _max, _page, _cateIds } = req.query;

  const searchWord = _q;

  const regexPattern = new RegExp(searchWord, "i");

  const page = _page || 1;

  const skip = (+page - 1) * _limit;

  try {
    const query = {
      name: regexPattern,
      // categoryId: {
      //   $in: categories || allCates,
      // },
    };

    if (_cateIds) {
      query.categoryId = {
        $in: _cateIds.split(","),
      };
    }

    if (_min !== undefined || _max !== undefined) {
      query.$expr = {
        $and: [],
      };

      if (_min !== undefined) {
        query.$expr.$and.push({
          $gte: [
            { $multiply: ["$oldPrice", { $subtract: [1, { $divide: ["$discount", 100] }] }] },
            parseFloat(_min),
          ],
        });
      }

      if (_max !== undefined) {
        query.$expr.$and.push({
          $lte: [
            { $multiply: ["$oldPrice", { $subtract: [1, { $divide: ["$discount", 100] }] }] },
            parseFloat(_max),
          ],
        });
      }
    }

    const products = await Product.find(query)
      .skip(skip)
      .limit(_limit || 8)
      .sort({
        [_sort]: _order || "desc",
      });

    const totalProducts = await Product.where(query).countDocuments();

    res.status(200).json({
      message: "Fetch all products successfully!",
      products,
      pagination: {
        _page: +_page || 1,
        _limit: +_limit || 12,
        _totalRows: totalProducts,
      },
    });
  } catch (error) {
    if (!error) {
      const error = new Error("Failed to fetch products!");
      error.statusCode = 422;
      return error;
    }
    next(error);
  }
};

exports.getMaxPrice = async (req, res, next) => {
  try {
    const max = await Product.aggregate([
      {
        $project: {
          maxFieldValue: {
            $multiply: ["$oldPrice", { $subtract: [1, { $divide: ["$discount", 100] }] }],
          },
        },
      },
      {
        $sort: {
          maxFieldValue: -1,
        },
      },
      { $limit: 1 },
    ]);

    res.status(200).json({
      message: "OK",
      result: max,
    });
  } catch (error) {
    if (!error) {
      const error = new Error("Failed to fetch price value!");
      error.statusCode(422);
      return error;
    }
    next(error);
  }
};

exports.getMinPrice = async (req, res, next) => {
  try {
    const min = await Product.aggregate([
      {
        $project: {
          minFieldValue: {
            $multiply: ["$oldPrice", { $subtract: [1, { $divide: ["$discount", 100] }] }],
          },
        },
      },
      {
        $sort: {
          minFieldValue: 1,
        },
      },
      { $limit: 1 },
    ]);

    res.status(200).json({
      message: "OK",
      result: min,
    });
  } catch (error) {
    if (!error) {
      const error = new Error("Failed to fetch price value!");
      error.statusCode(422);
      return error;
    }
    next(error);
  }
};

exports.getProductsInRange = async (req, res, next) => {
  const { _min, _max } = req.query;

  try {
    const products = await Product.find({
      $expr: {
        $and: [
          {
            $gte: ["$oldPrice", _min],
          },
          {
            $lte: ["$oldPrice", _max],
          },
          {
            $gte: [
              { $multiply: ["$oldPrice", { $subtract: [1, { $divide: ["$discount", 100] }] }] },
              _min,
            ],
          },

          {
            $gte: [
              { $multiply: ["$oldPrice", { $subtract: [1, { $divide: ["$discount", 100] }] }] },
              _max,
            ],
          },
        ],
      },
    });

    res.status(200).json({
      message: "Oke",
      products,
    });
  } catch (error) {
    if (!error) {
      const error = new Error("Failed to fetch products in range");
      error.statusCode(422);
      return error;
    }
    next(error);
  }
};

exports.getProduct = async (req, res, next) => {
  const { productId } = req.params;
  try {
    const product = await Product.findById(productId);
    res.status(200).json({
      message: "Fetch single product successfully!",
      product,
    });
  } catch (error) {
    if (!error) {
      const error = new Error("Failed to fetch products!");
      error.statusCode(422);
      return error;
    }
    next(error);
  }
};

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
    console.log("Create order!");

    const response = await order.save();
    // Update qty product at database (-qty);
    products.items.forEach(async (product) => {
      const { prodId, qty } = product;
      console.log("update stock qty at database!!!");
      const productItem = await Product.findById(prodId);
      productItem.stockQty = productItem.stockQty - qty;
      productItem.save();
    });

    // for (const product of products.items) {
    //   const { prodId, qty } = product;
    //   console.log("update stock qty at database!!!");
    //   const product = await Product.findById(prodId);
    //   product.stockQty = product.stockQty - qty;
    //   product.save();
    // }

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

exports.getUser = async (req, res, next) => {
  const { userId } = req.params;

  console.log("id: ", userId);

  try {
    const { user } = await User.findById(userId);

    console.log(user);

    res.status(200).json({
      message: "fetch single user successfully!",
      user: user,
    });
  } catch (error) {
    if (!error) {
      const error = new Error("Failed to fetch categories!");
      error.statusCode(422);
      return error;
    }
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {};

exports.getOrdersByIduser = async (req, res, next) => {};

exports.getOrders = async (req, res, next) => {};

exports.getInvoices = async (req, res, next) => {};
