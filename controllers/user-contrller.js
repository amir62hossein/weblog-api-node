const { v4: uuidv4 } = require("uuid");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");

const User = require("../models/user");

const users = [
  {
    id: "u1",
    name: "Amir Hossein",
    email: "amir@gmail.com",
    password: "12345",
  },
];

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError("getting users failed", 500);
    return next(error);
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Input Invalid", 422);
  }
  const { name, email, password } = req.body;
  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Signup failed ", 500);
    return next(error);
  }
  if (existingUser) {
    const error = new HttpError("User exist", 422);
    return next(error);
  }
  const createdUser = new User({
    name: name,
    email: email,
    password: password,
    image: "url",
    posts: [],
  });

  try {
    await createdUser.save();
  } catch (error) {
    error = new HttpError("signup failed", 500);
    return next(error);
  }
  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    error = new HttpError("login failed", 500);
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    error = new HttpError("invalid inputs", 401);
    return next(error);
  }

  res.json({
    message: "Logged in",
    user: existingUser.toObject({ getters: true }),
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
