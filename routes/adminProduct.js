const express = require("express");
const adminProductsController = require("../controllers/adminProducts");
const uploadMiddleware = require("../middleware/upload");
const isAuth = require("../middleware/is-auth");
const router = express.Router();
const { check, body } = require("express-validator");

// GET PRODUCTS
router.get("/products", adminProductsController.getProducts);

// GET BY RANGES[MIN, MAX];

// router.get("/products-by-price-range", adminProductsController.getProductsInRange);
router.get("/random-products", adminProductsController.createRandomProducts);

// GET PRODUCT

router.get("/products/:productId", adminProductsController.getProduct);

// POST PRODUCT
router.post(
  "/product",
  uploadMiddleware.array("images[]"),
  isAuth,
  adminProductsController.postProduct
);

// PUT PRODUCT
router.put(
  "/product/:productId",
  uploadMiddleware.array("images[]"),
  isAuth,
  adminProductsController.updateProduct
);

// DELETE PRODUCT
router.delete("/products/:productId", isAuth, adminProductsController.deleteProduct);

module.exports = router;
