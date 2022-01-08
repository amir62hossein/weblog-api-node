const router = require("express").Router();

const { check } = require("express-validator");

const postController = require("../controllers/post-controller");

router.get("/:pid", postController.getPostById);

router.get("/user/:uid", postController.getPostByUserId);

router.post(
  "/",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],

  postController.createPost
);

router.delete("/:pid", postController.deletePost);

module.exports = router;
// 60 ro didam
