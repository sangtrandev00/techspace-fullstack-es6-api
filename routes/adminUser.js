const express = require("express");

const adminUserController = require("../controllers/adminUsers");
const uploadMiddleware = require("../middleware/upload");
const isAuth = require("../middleware/is-auth");
const router = express.Router();
const { check, body } = require("express-validator");

// GET USERS
router.get("/users", isAuth, adminUserController.getUsers);

// GET USER
router.get("/users/:userId", isAuth, adminUserController.getUser);

// CREATE RANDOM USER

router.get("/random-users", isAuth, adminUserController.createRandomUser);

// POST USER (What is the order when using middleware like this ? To combine validation )
router.post("/user", uploadMiddleware.single("avatar"), isAuth, adminUserController.postUser);

// PUT CATE
router.put(
  "/user/:userId",
  uploadMiddleware.single("avatar"),
  isAuth,
  adminUserController.updateUser
);

// DELETE CATE
router.delete("/users/:userId", isAuth, adminUserController.deleteUser);

module.exports = router;
