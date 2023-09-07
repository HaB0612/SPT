var express = require("express");
var router = express.Router();

router.use("/table", require("../components/tableComponent.js"));
router.use("/message", require("../components/messageComponent.js"));
router.use("/assignment", require("../components/assignmentComponent.js"));
router.use("/issue", require("../components/issueComponent.js"));

module.exports = router;