const Message = require("../models/Message");

const createMessage = async (req, res) => {
  try {
    let user = req.session.user;
    const newMessage = new Message({
      sender: user._id,
      content: req.body.message,
      timestamp: Date.now(),
    });
    await newMessage.save();

    res
      .status(200)
      .json({ error: false, message: "Mesaj başarıyla gönderildi." });
  } catch (error) {
    res.status(200).json({ error: true, message: error.message });
  }
};

const editMessage = async (req, res) => {
  try {
    const updatedData = req.body;
    const messageID = req.body.messageID;
    const filter = {
      _id: messageID,
    };

    const message = await Message.findOne(filter);
    if (
      req.session.user._id.toString() == "64ec56f5969996b8d3dd3787" ||
      message.sender.toString() == req.session.user._id.toString()
    ) {
      await Message.findOneAndUpdate(filter, updatedData);

      res
        .status(200)
        .json({ error: false, message: "Mesaj başarıyla düzenlendi." });
    } else {
      return res.status(200).json({
        error: true,
        message:
          "Bu mesajın göndericisi siz değilsiniz, sadece kendi gönderdiğiniz mesajları düzenleyebilirsiniz.",
      });
    }
  } catch (error) {
    res.status(200).json({ error: true, message: error.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const messageID = req.params.messageID;
    const filter = {
      _id: messageID,
    };
    const message = await Message.findOne({ _id: messageID }).exec();
    if (
      req.session.user._id.toString() == "64ec56f5969996b8d3dd3787" ||
      message.sender.toString() == req.session.user._id.toString()
    ) {
      await Message.findOneAndDelete({ _id: messageID });

      res
        .status(200)
        .json({ error: false, message: "Mesaj başarıyla silindi." });
    } else {
      return res.status(200).json({
        error: true,
        message:
          "Bu mesajın göndericisi siz değilsiniz, sadece kendi gönderdiğiniz mesajları silebilirsiniz.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(200).json({ error: true, message: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({});

    res
      .status(200)
      .json({ error: false, message: "Veri başarıyla gönderildi.", messages });
  } catch (error) {
    res.status(200).json({ error: true, message: error.message });
  }
};

module.exports = {
  createMessage,
  editMessage,
  deleteMessage,
  getMessages,
};
