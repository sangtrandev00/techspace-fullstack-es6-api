const express = require("express");
const uploadMiddleware = require("../middleware/upload");

const adminCategoriesController = require("../controllers/adminCategories");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

// GET CATEGORIES
router.get("/categories", adminCategoriesController.getCategories);

// GET CATEGORY
router.get("/categories/:categoryId", adminCategoriesController.getCategory);

// POST CATE
// Should put the middleware upload multer here at route
router.post(
  "/category",
  uploadMiddleware.single("cateImage"),
  adminCategoriesController.postCategory
);

// PUT CATE
router.put(
  "/category/:categoryId",
  uploadMiddleware.single("cateImage"),
  adminCategoriesController.updateCategories
);

// DELETE CATE
router.delete("/categories/:categoryId", isAuth, adminCategoriesController.deleteCategory);

module.exports = router;
