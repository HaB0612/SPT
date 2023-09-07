var express = require("express");
var router = express.Router();
const { checkUser, checkUserAuth } = require("../middleware/authMiddleware")
const {
  createAssignment,
  editAssignment,
  deleteAssignment,
  getAssignments,
  complateAssignment
} = require("../controllers/assignmentController");

router
  .route("/assignment")
  .post(checkUser, checkUserAuth("admin","teacher"), createAssignment)
  .put(checkUser, checkUserAuth("admin","teacher"), editAssignment)

router.route("/complate/:assignmentID").put(checkUser, checkUserAuth("admin","teacher"), complateAssignment)
router.route("/assignment/:assignmentID")
  .delete(checkUser, checkUserAuth("admin","teacher"), deleteAssignment);

router.get("/assignments", checkUser, getAssignments);

module.exports = router;
