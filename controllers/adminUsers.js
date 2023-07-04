const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { deleteFile } = require("../utils/file");
const { faker } = require("@faker-js/faker");
const { validationResult } = require("express-validator");
const customError = require("../utils/error");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    // console.log("users: ", users);
    res.status(200).json({
      message: "Fetch users sucessfully!",
      users,
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

exports.getUser = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    res.status(200).json({
      message: "fetch single user successfully!",
      user,
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

exports.createRandomUser = async (req, res, next) => {
  try {
    let result = [];

    for (let i = 0; i < 10; i++) {
      const userData = {
        providerId: "local",
        name: faker.person.fullName(),
        avatar: faker.image.avatarLegacy(),
        email: faker.internet.email({ provider: "gmail.com" }),
        phone: faker.phone.number("0#########"),
        address: faker.location.streetAddress(),
        password: await bcrypt.hash("123456789", 12),
        role: "client",
        payment: "COD",
      };

      const newUser = new User(userData);

      await newUser.save();

      result.push(newUser);
    }

    res.status(200).json({
      message: "Get random users !!!",
      result,
    });
  } catch (error) {
    if (!error.statusCode) {
      const error = new Error("Failed to get random users!");
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.postUser = async (req, res, next) => {
  const { name, email, phone, address, password, role } = req.body;

  console.log(req.file);
  let avatar;
  if (req.file) {
    avatar = req.file.path.replace("\\", "/");
  } else {
    avatar = "images/user-avatar.jpg";
  }

  //   No validate yet!
  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      email,
      name,
      phone,
      avatar,
      address,
      role,
      password: hashedPassword,
    });
    const result = await newUser.save();

    res.status(201).json({
      message: "User created successfully!",
      userId: result._id,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  const { name, address, oldAvatar, email, phone, role, password } = req.body;
  const { userId } = req.params;
  console.log(req.file);
  console.log("old avatar: ", oldAvatar);

  let avatar;
  if (req.file) {
    avatar = req.file.path.replace("\\", "/");
  } else {
    avatar = oldAvatar;
  }
  console.log("avatar: ", avatar);

  try {
    const currentUser = await User.findById(userId);
    console.log("current user: ", currentUser);
    const hashedPassword = await bcrypt.hash(password, 12);
    currentUser.name = name;
    currentUser.address = address;
    if (oldAvatar !== avatar) {
      currentUser.avatar = avatar;
      deleteFile(oldAvatar);
      console.log("update avatar!");
    }
    currentUser.email = email;
    currentUser.password = hashedPassword;
    currentUser.phone = phone;
    currentUser.role = role;
    const response = await currentUser.save();

    res.status(200).json({
      message: "Update user succesfully!",
      user: response,
    });
  } catch (error) {
    if (!error) {
      const error = new Error("Failed to update user!");
      error.statusCode(422);
      return error;
    }
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const { avatar } = await User.findById(userId);
    const response = await User.deleteOne({
      _id: userId,
    });
    res.status(200).json({
      message: "user deleted successfully!",
      userId: userId,
    });
    // Delete avatar image

    !avatar.startsWith("http") && deleteFile(avatar);
  } catch (error) {
    if (!error) {
      const error = new Error("Failed to fetch categories!");
      error.statusCode(422);
      return error;
    }

    next(error);
  }
};
