var express = require("express");
var router = express.Router();
const { checkUser, checkUserAuth } = require("../middleware/authMiddleware")
const { login, logout } = require("../controllers/authController");
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 100000, 
    max: 15, 
    message: 'Çok fazla giriş denemesinde bulundunuz.', 
  });

router.route("/login").post(limiter, login);

router.route("/logout").get(logout);

module.exports = router;
