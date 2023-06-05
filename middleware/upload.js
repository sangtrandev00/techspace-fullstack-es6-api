const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4().substring(0, 8) + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PNG, JPG, and JPEG files are allowed."));
  }
};

// app.use(multer({ storage: fileStorage })).array("images");
// const uploadCategoryMiddleware = multer({
//   storage: fileStorage,
//   fileFilter: fileFilter,
// }).single("cateImage");

// const uploadProductMiddleware = multer({
//   storage: fileStorage,
//   fileFilter: fileFilter,
// }).array("images");

module.exports = multer({
  storage: fileStorage,
  filter: fileFilter,
});

// exports.uploadCategoryMiddleware = uploadCategoryMiddleware;
// exports.uploadProductMiddleware = uploadProductMiddleware;
