const { v4: uuidv4 } = require("uuid");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const postSchema = require("../models/post");
const UserSchema = require("../models/user");

const getPostById = async (req, res, next) => {
  const postId = req.params.pid;

  let post;

  try {
    post = await postSchema.findById(postId);
  } catch (error) {
    error = new HttpError("faild to find post", 500);
    return next(error);
  }

  if (!post) {
    error = new HttpError("Not Found Post", 404);
    return next(error);
  }
  res.json({ post: post.toObject({ getters: true }) });
};

const getPostByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let posts;
  try {
    posts = await postSchema.find({ creator: userId });
  } catch (error) {
    error = new HttpError("faild to find post", 500);
    return next(error);
  }
  if (!posts) {
    error = new HttpError("Not Found Post", 404);
    return next(error);
  }
  res.json({ posts: posts.map((post) => post.toObject({ getters: true })) });
};

const createPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid Input", 422);
  }
  const { title, description, creator } = req.body;

  const createdPost = new postSchema({
    title: title,
    description: description,
    image: "url",
    creator: creator,
  });
  let user;

  try {
    user = await UserSchema.findById(creator);
  } catch (error) {
    error = new HttpError("cannot create post", 500);
    return next(error);
  }

  if (!user) {
    error = new HttpError("could not find user", 422);
    return next(error);
  }

  try {
    await createdPost.save();
    user.posts.push(createdPost);
    await user.save();
  } catch (err) {
    error = new HttpError("faild created post", 500);
    return next(error);
  }
  res.status(201).json({ post: createdPost });
};

const deletePost = async (req, res, next) => {
  const postid = req.params.pid;

  let post;

  try {
    post = await postSchema.findById(postid).populate("creator");
  } catch (error) {
    error = new HttpError("faild delete post", 500);
    return next(error);
  }

  try {
    await post.remove();
    post.creator.posts.pull(post);
    await post.creator.save();
  } catch (error) {
    error = new HttpError("faild delete post", 500);
    return next(error);
  }

  res.json({ message: "post deleted" });
};

exports.getPostById = getPostById;
exports.getPostByUserId = getPostByUserId;
exports.createPost = createPost;
exports.deletePost = deletePost;
// 78 ro bayad bebinam
