const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const assignmentSchema = new mongoose.Schema({
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  lesson: { type: Number, required: true },
  completionDate: { type: Date, required: false },
  deadline: { type: Date, required: true },
  timestamp: { type: Date, default: Date.now },
});

assignmentSchema.pre("validate", async function (next) {
  const isValidLesson = this.lesson >= 1 && this.lesson <= 5;
  if (
    !this.sender ||
    !this.title ||
    !this.description ||
    isNaN(this.lesson) ||
    !this.deadline ||
    !isValidLesson
  ) {
    return next(new Error("Bir hata oluştu. Lütfen tekrar deneyiniz."));
  }
  next();
});

module.exports = mongoose.model("Assignment", assignmentSchema);
