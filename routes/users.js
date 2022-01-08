const router = require("express").Router();

const { check } = require("express-validator");

const userController = require("../controllers/user-contrller");

router.get("/", userController.getUsers);

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 5 }),
  ],
  userController.signup
);

router.post("/login", userController.login);

module.exports = router;
