var express = require("express");
var router = express.Router();
const Cell = require("../models/Cell");
const Week = require("../models/Week");
const { checkUser, checkUserAuth } = require("../middleware/authMiddleware");
const {
  getWeek,
  editCell,
  getCell,
  removeCell,
  createTable,
  createPDF,
} = require("../controllers/tableController");

router
  .route("/weeks")
  .get(checkUser, checkUserAuth("admin", "teacher"), getWeek);

router
  .route("/cells")
  .put(checkUser, checkUserAuth("admin", "teacher"), editCell)
  .get(checkUser, checkUserAuth("admin", "teacher"), getCell)
  .delete(checkUser, checkUserAuth("admin", "teacher"), removeCell);

router.get("/create",checkUser, checkUserAuth("admin"), function (req, res) {
  createTable();
  res.status(200).json({ error: false, message: "İşlem başarılı." });
});

router.get("/pdf", checkUser, checkUserAuth("admin", "teacher"), createPDF);

module.exports = router;
