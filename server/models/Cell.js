const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Week = require("./Week");

const exerciseStatsSchema = new mongoose.Schema({
  total: { type: Number, required: true },
  correct: { type: Number, required: true },
  wrong: { type: Number, required: true },
  empty: { type: Number, required: true },
});

const cellSchema = new mongoose.Schema({
  title: { type: String, required: true },
  week: { type: Number, required: true, uniqe: true },
  day: { type: Number, required: true, min: 1, max: 6 },
  lesson: { type: Number, required: true, min: 1, max: 5 },
  exerciseStats: { type: exerciseStatsSchema, required: true },
});

cellSchema.statics.getWeek = function () {
  const referenceDate = new Date("2023-06-26");
  const currentDate = new Date();
  const timeDifference = currentDate - referenceDate;
  const oneWeekInMillis = 7 * 24 * 60 * 60 * 1000;
  const weekNumber = Math.floor(timeDifference / oneWeekInMillis) + 1;
  return weekNumber;
};

cellSchema.pre("validate", async function (next) {
  this.week = this.constructor.getWeek();

  const isValidDay = !isNaN(this.day) && this.day >= 1 && this.day <= 6;
  const isValidLesson = this.lesson >= 1 && this.lesson <= 5;
  const isValidExerciseStats =
    this.exerciseStats &&
    typeof this.exerciseStats.total === "number" &&
    typeof this.exerciseStats.correct === "number" &&
    typeof this.exerciseStats.wrong === "number" &&
    typeof this.exerciseStats.empty === "number";

  if (!this.title || !isValidDay || !isValidLesson || !isValidExerciseStats) {
    return next(new Error("Bir hata oluştu. Lütfen tekrar deneyiniz."));
  }

  try {
    const weekExists = await Week.exists({ week: this.week });

    if (!weekExists) {
      return next(new Error("Hafta bulunamadı."));
    }
    const existingCell = await this.constructor.findOne({
      _id: { $ne: this._id },
      week: this.week,
      day: this.day,
      lesson: this.lesson,
    });

    if (existingCell) {
      return next(
        new Error(
          "Zaten mevcut bir gün, hafta ve ders için işlem yapamazsınız."
        )
      );
    }

    next();
  } catch (error) {
    return next(error);
  }

  next();
});

module.exports = mongoose.model("Cell", cellSchema);
