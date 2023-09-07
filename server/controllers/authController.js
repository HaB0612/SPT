const User = require("../models/User");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(200).json({
        error: true,
        message: "Lütfen kullanıcı adı ve şifre giriniz.",
      });

    const user = await User.findOne({ username });

    if (!user) {
      return res
        .status(200)
        .json({ error: true, message: "Kullanıcı bulunamadı." });
    }
    
    if (password !== user.password) {
      return res
        .status(200)
        .json({ error: true, message: "Şifreyi yanlış girdiniz." });
    }

    req.session.user = user;

    res
      .status(200)
      .json({ error: false, message: "Başarılı bir şekilde giriş yapıldı." });
  } catch (error) {
    res.status(200).json({ error: true, message: error.message });
  }
};

const logout = async (req, res) => {
  try {
    if(!req.session.user) return res.status(200).json({error:true, message: "Zaten bir hesaba giriş yapılmamış."})
    req.session.destroy();

    res
      .status(200)
      .json({ error: true, message: "Başarılı bir şekilde çıkış yapıldı." });
  } catch (error) {
    res.status(200).json({ error: true, message: error.message });
  }
};

module.exports = {
  login,
  logout
};
