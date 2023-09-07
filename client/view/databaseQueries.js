const CellModel = require("../../server/models/Cell");
const WeekModel = require("../../server/models/Week");
const AssignmentModel = require("../../server/models/Assignment");

async function getCellsInCurrentWeek() {
  const cellsInCurrentWeek = await CellModel.aggregate([
    {
      $lookup: {
        from: "weeks",
        localField: "week",
        foreignField: "week",
        as: "weekInfo",
      },
    },
    {
      $match: {
        "weekInfo.week": WeekModel.getWeek(),
      },
    },
  ]);
  return cellsInCurrentWeek;
}

async function getAllWeeksData() {
  const allWeeksData = await WeekModel.find({});
  return allWeeksData;
}

async function calculateAssignmentCompletionRate() {
  const totalAssignments = await AssignmentModel.countDocuments();
  const completedAssignments = await AssignmentModel.countDocuments({
    completionDate: { $exists: true },
  });

  if (totalAssignments > 0) {
    return Math.round((completedAssignments / totalAssignments) * 100);
  } else {
    return 0;
  }
}

async function getAssignmentStatsForCurrentWeek() {
  const assignmentStatsForCurrentWeek = await CellModel.aggregate([
    {
      $match: {
        week: WeekModel.getWeek(),
      },
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: "$exerciseStats.total",
        },
      },
    },
  ]);
  return assignmentStatsForCurrentWeek;
}

async function getAssignmentStatsForAllWeeks() {
  const assignmentStatsForAllWeeks = await CellModel.aggregate([
    {
      $group: {
        _id: null,
        total: {
          $sum: "$exerciseStats.total",
        },
      },
    },
  ]);
  return assignmentStatsForAllWeeks;
}

module.exports = {
  getCellsInCurrentWeek,
  getAllWeeksData,
  calculateAssignmentCompletionRate,
  getAssignmentStatsForCurrentWeek,
  getAssignmentStatsForAllWeeks,
};
