const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const issueSchema = new mongoose.Schema({
    title: { type: String, required: true },
    resource: { type: String, required: true},
    timestamp: { type: Date, default: Date.now },
    lesson: { type: Number, required: true },
    answer: { type: String, required: true},
    isSolved: {type:Boolean, default: false}
}); 

issueSchema.pre("validate", async function (next) {
  const isValidLesson = this.lesson >= 1 && this.lesson <= 5;
  if (
    !this.title ||
    !this.resource ||
    !this.answer ||
    isNaN(this.lesson) ||
    !isValidLesson
  ) {
    return next(new Error("Bir hata oluştu. Lütfen tekrar deneyiniz."));
  }
  next();
});

module.exports = mongoose.model("Issue", issueSchema);
