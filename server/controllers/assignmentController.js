const Assignment = require("../models/Assignment");

const createAssignment = async (req, res) => {
  try {
    const { title, description, lesson, deadline } = req.body;

    const newAssignment = new Assignment({
      sender: req.session.user._id,
      title: title,
      description: description,
      lesson: lesson,
      deadline: deadline,
      timestamp: Date.now(),
    });

    await newAssignment.save();

    res
      .status(200)
      .json({ error: false, message: "Ödev başarıyla oluşturuldu." });
  } catch (error) {
    res.status(200).json({ error: true, message: error.message });
  }
};

const editAssignment = async (req, res) => {
  try {
    const updatedData = req.body;
    const assignmentID = req.body.assignmentID;
    const filter = {
      _id: assignmentID,
    };

    const assignment = await Assignment.findOne(filter);
    if (
      req.session.user._id.toString() == "64ec56f5969996b8d3dd3787" &&
      assignment.sender.toString() == req.session.user._id.toString()
    ) {
      const newAssignment = await Assignment.findOneAndUpdate(
        filter,
        updatedData
      );

      res
        .status(200)
        .json({ error: false, message: "Ödev başarıyla düzenlendi." });
    } else {
      return res.status(200).json({
        error: true,
        message:
          "Bu ödevin göndericisi siz değilsiniz, sadece kendi gönderdiğiniz ödevleri düzenleyebilirsiniz.",
      });
    }
  } catch (error) {
    res.status(200).json({ error: true, message: error.message });
  }
};

const deleteAssignment = async (req, res) => {
  try {
    const assignmentID = req.params.assignmentID;
    const assignment = await Assignment.findOne({ _id: assignmentID }).exec();
    if (
      req.session.user._id.toString() == "64ec56f5969996b8d3dd3787" &&
      assignment.sender.toString() == req.session.user._id.toString()
    ) {
      await Assignment.findOneAndDelete({ _id: assignmentID });

      res
        .status(200)
        .json({ error: false, message: "Ödev başarıyla silindi." });
    } else {
      return res.status(200).json({
        error: true,
        message:
          "Bu ödevin göndericisi siz değilsiniz, sadece kendi gönderdiğiniz ödevleri silebilirsiniz.",
      });
    }
  } catch (error) {
    res.status(200).json({ error: true, message: error.message });
  }
};

const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({});

    res.status(200).json({
      error: false,
      message: "Veri başarıyla gönderildi.",
      assignments,
    });
  } catch (error) {
    res.status(200).json({ error: true, message: error.message });
  }
};

const complateAssignment = async (req, res) => {
  try {
    const assignmentID = req.params.assignmentID;
    const filter = {
      _id: assignmentID,
    };

    const assignment = await Assignment.findOne(filter);
    const newAssignment = await Assignment.findOneAndUpdate(filter, {
      completionDate: Date.now(),
    });

    res
      .status(200)
      .json({ error: false, message: "Ödev başarıyla düzenlendi." });
  } catch (error) {
    res.status(200).json({ error: true, message: error.message });
  }
};
module.exports = {
  createAssignment,
  editAssignment,
  deleteAssignment,
  getAssignments,
  complateAssignment,
};
