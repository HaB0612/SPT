var express = require("express");
var router = express.Router();
const { checkUser, checkUserAuth } = require("../middleware/authMiddleware");
const {
  createIssue,
  editIssue,
  deleteIssue,
  getIssues,
} = require("../controllers/issueController");
const multer = require("multer");
const inMemoryStorage = multer.memoryStorage();
const upload = multer({ storage: inMemoryStorage });

router
  .route("/issue")
  .post(
    checkUser,
    checkUserAuth("admin", "guest"),
    upload.single("imageFile"),
    createIssue
  )
  .put(checkUser, checkUserAuth("admin", "guest"), editIssue)
router.route("/issue/:IssueID")
  .delete(checkUser, checkUserAuth("admin", "guest"), deleteIssue);

router.get("/issues", checkUser, checkUserAuth("admin", "guest"), getIssues);

module.exports = router;
