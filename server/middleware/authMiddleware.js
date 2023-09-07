const checkUserAuth = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.session.user.role)) {
      return res
        .status(200)
        .json({ error: true, message: "Yetersiz yetkilendirme." });
    }
    next();
  };
};

const checkUser = (req, res, next) => {
  if (!req.session.user) {
    return res
      .status(200)
      .json({ error: true, message: "Lütfen giriş yapınız." });
  }
  next();
};

module.exports = {
  checkUserAuth,
  checkUser
};
