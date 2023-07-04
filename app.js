const path = require("path");
const { v4: uuidv4 } = require("uuid");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const mongoose = require("mongoose");

// Routers
const authRouter = require("./routes/auth");
const adminCategoryRouter = require("./routes/adminCategory");
const adminProductRouter = require("./routes/adminProduct");
const adminUserRouter = require("./routes/adminUser");
const adminOrderRouter = require("./routes/adminOrder");
const shopRouter = require("./routes/shop");
const app = express();

const port = process.env.PORT || 8080;

// const MONGODB_URI = "mongodb://127.0.0.1:27017/fullstack_es6";

const MONGODB_URI =
  "mongodb+srv://nhatsang0101:48nJ1AfSQzAeKHoC@cluster0.aup360f.mongodb.net/fullstack_es6";

// app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// uploadCategoryMiddleware,
app.use("/auth", authRouter);
app.use("/admin", adminCategoryRouter);
app.use("/admin", adminProductRouter);
app.use("/admin", adminUserRouter);
app.use("/admin", adminOrderRouter);
app.use(shopRouter);

// Middleware handler error!!!
app.use((error, req, res, next) => {
  console.log(error);

  const status = error.statusCode || 500;
  const message = error.message;
  const errorType = error.errorType || "unknown";
  const data = error.data;

  res.status(status).json({
    message: message,
    errorType,
    data: data,
  });
});

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
