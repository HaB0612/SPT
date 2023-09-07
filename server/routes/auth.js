var express = require("express");
var router = express.Router();

router.use('/', require("../components/authComponent.js"));

module.exports = router;