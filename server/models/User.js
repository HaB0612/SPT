const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, uniqe: true },
  password: { type: String},
  role: { type: String },
  profilePictureURL: { type: String, required: false },
});

userSchema.pre("validate", async function (next) {
  if (
    !this.username ||
    !this.password ||
    !this.role ||
    !this.profilePictureURL
  ) {
    return next(new Error("Bir hata oluştu. Lütfen tekrar deneyiniz."));
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
