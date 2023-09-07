const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const formatter = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
});
const formatterformonth = new Intl.DateTimeFormat("tr-TR", {
  month: "long",
});

const weekSchema = new mongoose.Schema({
  week: { type: Number, required: true, unique: true },
  startdate: { type: String, required: true },
  enddate: { type: String, required: true },
  month: { type: String, required: true },
  cells: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Cell", required: false },
  ],
});

weekSchema.statics.getWeek = function () {
  const referenceDate = new Date("2023-06-26");
  const currentDate = new Date();
  const timeDifference = currentDate - referenceDate;
  const oneWeekInMillis = 7 * 24 * 60 * 60 * 1000;
  const weekNumber = Math.floor(timeDifference / oneWeekInMillis) + 1;
  return weekNumber;
};

weekSchema.statics.getStartDate = function () {
  const currentDate = new Date();
  const dayOfWeek = currentDate.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - daysToMonday);
  const options = { day: "numeric" };
  const formattedStartOfWeek = startOfWeek.toLocaleDateString("tr-TR", options);
  return formattedStartOfWeek;
};

weekSchema.statics.getMonth = function () {
  const currentDate = new Date();
  const months = [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ];
  const currentMonth = months[currentDate.getMonth()];
  return currentMonth;
};

weekSchema.statics.getEndDate = function () {
  const currentDate = new Date();
  const dayOfWeek = currentDate.getDay();
  const daysToEndOfWeek = 7 - dayOfWeek;
  const endOfWeek = new Date(currentDate);
  endOfWeek.setDate(currentDate.getDate() + daysToEndOfWeek);
  const options = { day: "numeric" };
  const formattedEndOfWeek = endOfWeek.toLocaleDateString("tr-TR", options);
  return formattedEndOfWeek;
};

weekSchema.pre("validate", async function (next) {
  this.week = this.constructor.getWeek();
  this.startdate = this.constructor.getStartDate();
  this.enddate = this.constructor.getEndDate();
  this.month = this.constructor.getMonth();

  const isValidWeek = !this.week || typeof this.week !== "number";
  const isValidStartDate = this.startdate;
  const isValidEndDate = this.enddate;
  if (isValidWeek || !isValidStartDate || !isValidEndDate) {
    return next(new Error("Bir hata oluştu. Lütfen tekrar deneyiniz."));
  }

  next();
});

weekSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    next(new Error("Bu hafta zaten mevcut."));
  } else {
    next(error);
  }
});

module.exports = mongoose.model("Week", weekSchema);
