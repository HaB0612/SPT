const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new mongoose.Schema({
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

messageSchema.pre("validate", async function (next) {
  if (!this.sender || !this.content) {
    return next(new Error("Bir hata oluştu. Lütfen tekrar deneyiniz."));
  }
  next();
});

module.exports = mongoose.model("Message", messageSchema);
