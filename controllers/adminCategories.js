const Category = require("../models/Category");
const { deleteFile } = require("../utils/file");

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
  }
};

exports.getCategory = async (req, res, next) => {
  const { categoryId } = req.params;

  try {
    const category = await Category.findById(categoryId);
    res.status(200).json({
      message: "fetch single category successfully!",
      category,
    });
  } catch (error) {
    if (!error) {
      const error = new Error("Failed to fetch categories!");
      error.statusCode(422);
      return error;
    }
  }
};

exports.postCategory = async (req, res, next) => {
  const { name, description } = req.body;

  // if (!req.file) {
  //   const error = new Error("No image provided.");
  //   error.statusCode = 422;
  //   throw error;
  // }

  // Category: check whether category is already in the database ?

  const imageUrl = req.file ? req.file.path.replace("\\", "/") : "images/user-avatar.jpg";

  try {
    const category = new Category({ name, cateImage: imageUrl, description });
    const response = await category.save();
    res.status(201).json({
      message: "Create category succesfully!",
      category: response,
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

exports.updateCategories = async (req, res, next) => {
  const { name, description, oldImage, categoryId } = req.body;

  // Handling error when no upload images
  // if (!req.file) {
  //   const error = new Error("No image provided.");
  //   error.statusCode = 422;
  //   throw error;
  // }

  try {
    const currentCategory = await Category.findById(categoryId);
    currentCategory.name = name;
    currentCategory.description = description;
    // If file is empty get the old one!
    if (req.file) {
      console.log(req.file);
      const cateImage = req.file.path.replace("\\", "/");
      currentCategory.cateImage = cateImage;

      // Delete the old image
      deleteFile(oldImage);
    }

    const response = await currentCategory.save();

    res.status(200).json({
      message: "Update category succesfully!",
      category: response,
    });
  } catch (error) {
    if (!error) {
      const error = new Error("Failed to fetch categories!");
      error.statusCode(422);
      return error;
    }
  }
};

exports.deleteCategory = async (req, res, next) => {
  const { categoryId } = req.params;
  try {
    const { cateImage } = await Category.findById(categoryId);
    const response = await Category.deleteOne({
      _id: categoryId,
    });
    res.status(200).json({
      message: "Category deleted successfully!",
      categoryId: categoryId,
    });

    // delete file when delete cate row
    deleteFile(cateImage);
  } catch (error) {
    if (!error) {
      const error = new Error("Failed to fetch categories!");
      error.statusCode(422);
      return error;
    }
  }
};
