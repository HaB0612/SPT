var express = require("express");
var router = express.Router();
const { checkUser, checkUserAuth } = require("../middleware/authMiddleware")
const {
  createMessage,
  editMessage,
  deleteMessage,
  getMessages,
} = require("../controllers/messageController");

router
  .route("/message")
  .post(checkUser, checkUserAuth("admin","teacher"), createMessage)
  .put(checkUser, checkUserAuth("admin","teacher"), editMessage)
router.route("/message/:messageID")
  .delete(checkUser, checkUserAuth("admin","teacher"), deleteMessage);

router.get("/messages", checkUser, checkUserAuth("admin","teacher"), getMessages);

module.exports = router;
