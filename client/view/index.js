var express = require("express");
var router = express.Router();
const Cell = require("../../server/models/Cell");
const User = require("../../server/models/User");
const Issue = require("../../server/models/Issue");
const axios = require('axios');
const Message = require("../../server/models/Message");
const Assignment = require("../../server/models/Assignment");
const {
  getCellsInCurrentWeek,
  getAllWeeksData,
  calculateAssignmentCompletionRate,
  getAssignmentStatsForCurrentWeek,
  getAssignmentStatsForAllWeeks,
} = require("./databaseQueries");

router.get("/", async function (req, res, next) {
  try {
    if (!req.session.user) return res.redirect("/login");
    if (req.session.user.role == "guest") return res.redirect("/issue");
    const Messages = await Message.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "sender",
          foreignField: "_id",
          as: "senderData",
        },
      },
    ]);
    const Assignments = await Assignment.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "sender",
          foreignField: "_id",
          as: "senderData",
        },
      },
    ]);
    Messages.reverse();
    Assignments.reverse();
    const cellsInCurrentWeek = await getCellsInCurrentWeek();
    const allWeeksData = await getAllWeeksData();
    const formattedWeeks = allWeeksData.map((week) => ({
      date: `${week.startdate} - ${week.enddate} ${week.month}`,
      week: week.week,
    }));
    const assignmentCompletionRate = await calculateAssignmentCompletionRate();
    const assignmentStatsForCurrentWeek =
      await getAssignmentStatsForCurrentWeek();
    const assignmentStatsForAllWeeks = await getAssignmentStatsForAllWeeks();

    const totalAssignmentsForAllWeeks =
      assignmentStatsForAllWeeks.length > 0
        ? assignmentStatsForAllWeeks[0].total
        : "0";

    const totalAssignmentsForCurrentWeek =
      assignmentStatsForCurrentWeek.length > 0
        ? assignmentStatsForCurrentWeek[0].total
        : "0";

    res.render("index", {
      loggedInUser: req.session.user,
      totalAssignmentsForCurrentWeek,
      totalAssignmentsForAllWeeks,
      assignmentCompletionRate,
      formattedWeeks,
      cellsInCurrentWeek,
      allWeeksData,
      Messages,
      Assignments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Bir hata oluştu.");
  }
});

router.get("/login", function (req, res, next) {
  res.render("login");
});

router.get("/404", function (req, res, next) {
  res.render("404");
});

router.get("/assignment", async function (req, res, next) {
  try {
    if (!req.session.user) return res.redirect("/login");
    if (req.session.user.role == "guest") return res.redirect("/issue");
    const Messages = await Message.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "sender",
          foreignField: "_id",
          as: "senderData",
        },
      },
    ]);
    const Assignments = await Assignment.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "sender",
          foreignField: "_id",
          as: "senderData",
        },
      },
    ]);
    Messages.reverse();
    Assignments.reverse();
    res.render("assignment", {
      loggedInUser: req.session.user,
      Messages,
      Assignments,
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/issue", async function (req, res, next) {
  try {
    if (!req.session.user) return res.redirect("/login");
    if (req.session.user.role == "teacher") return res.redirect("/issue");
    const totalIssues = await Issue.countDocuments();
    const solvedIssues = await Issue.countDocuments({
      isSolved: true,
    });
    const unsolvedIssues = await Issue.countDocuments({
      isSolved: false,
    });
    const Issues = await Issue.find({});
    Issues.reverse();
    res.render("issue", {
      user: req.session.user,
      totalIssues,
      solvedIssues,
      unsolvedIssues,
      Issues,
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/message", async function (req, res, next) {
  try {
    if (!req.session.user) return res.redirect("/login");
    if (req.session.user.role == "guest") return res.redirect("/issue");
    const Messages = await Message.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "sender",
          foreignField: "_id",
          as: "senderData",
        },
      },
    ]);
    const Assignments = await Assignment.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "sender",
          foreignField: "_id",
          as: "senderData",
        },
      },
    ]);

    Messages.reverse();
    Assignments.reverse();
    res.render("message", {
      loggedInUser: req.session.user,
      Messages,
      Assignments,
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
