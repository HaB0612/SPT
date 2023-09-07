const Issue = require("../models/Issue");
const multer = require("multer");
const { ImgurClient } = require("imgur");
const clientId = "";
const client = new ImgurClient({ clientId: clientId });

const inMemoryStorage = multer.memoryStorage();
const upload = multer({ storage: inMemoryStorage });

const checkFileType = (file) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/svg"];
  return allowedTypes.includes(file.mimetype);
};

const createIssue = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(200).json({ error: true, message: "Dosya bulunamadı" });
    }

    if (!checkFileType(req.file)) {
      return res
        .status(200)
        .json({ error: true, message: "Geçersiz dosya türü" });
    }

    const response = await client.upload({
      image: req.file.buffer.toString("base64"),
      title: req.body.title,
      type: "base64",
    });
    console.log(response)
    if (response.success !== true) {
      return res.status(200).json({ error: true, message: "Bir hata oluştu." });
    }
    const newIssue = new Issue({
      title: req.body.title,
      resource: response.data.link,
      lesson: req.body.lesson,
      answer: req.body.answer,
      isSolved: false,
    });
    await newIssue.save();

    res
      .status(200)
      .json({ error: false, message: "Soru başarıyla oluşturuldu." });
  } catch (error) {
    res.status(200).json({ error: true, message: error.message });
  }
};

const editIssue = async (req, res) => {
  try {
    const updatedData = req.body;
    const IssueID = req.body.IssueID;
    const filter = {
      _id: IssueID,
    };

    await Issue.findOneAndUpdate(filter, updatedData);

    res
      .status(200)
      .json({ error: false, message: "Soru başarıyla düzenlendi." });
  } catch (error) {
    res.status(200).json({ error: true, message: error.message });
  }
};

const deleteIssue = async (req, res) => {
  try {
    const issueID = req.params.IssueID;
    const issue = await Issue.findOne({ _id: issueID });

    await Issue.findOneAndDelete({ _id: issueID });

    res.status(200).json({ error: false, message: "Soru başarıyla silindi." });
  } catch (error) {
    res.status(200).json({ error: true, message: error.message });
  }
};

const getIssues = async (req, res) => {
  try {
    const issues = await Issue.find({});

    res
      .status(200)
      .json({ error: false, message: "Veri başarıyla gönderildi.", issues });
  } catch (error) {
    res.status(200).json({ error: true, message: error.message });
  }
};

module.exports = {
  createIssue,
  editIssue,
  deleteIssue,
  getIssues,
};
