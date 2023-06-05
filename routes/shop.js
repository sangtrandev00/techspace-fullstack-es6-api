const express = require("express");
const shopController = require("../controllers/shop");
const isAuth = require("../middleware/is-auth");
const router = express.Router();

// GET PRODUCTS/
router.get("/products", shopController.getProducts);

// GET PRODUCT
router.get("/products/:productId", shopController.getProduct);

// POST reset password

// GET CATES
router.get("/categories", shopController.getCategories);

// GET MAX PRICE
router.get("/product-max-price", shopController.getMaxPrice);

// GET MIN PRICE
router.get("/product-min-price", shopController.getMinPrice);

// GET CATES -- ID
router.get("/categories/:categoryId", shopController.getCategory);

// router.get('/status', shopController.getUserStatus)

router.patch("/products/:productId", shopController.updateViews);

// POST ORDER
router.post("/order", shopController.postOrder);

// GET ORDER: id
router.get("/orders/:orderId", shopController.getOrder);

// GET USER: id

router.get("/users/:userId", isAuth, shopController.getUser);

module.exports = router;
