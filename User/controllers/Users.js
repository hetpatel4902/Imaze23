const User = require("../models/Users");
const Event = require("../models/Event");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors/index");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
// Importing modules
const pdfkit = require("pdfkit");

const getOneEvent = async (req, res) => {};
const getAllEvents = async (req, res) => {
  const { search, fields } = req.query;
  var events;
  if (!search) {
    events = await Event.find({}).select(fields);
  } else {
    events = await Event.find({
      name: { $regex: search, $options: "i" },
    }).select(fields);
  }
  res.status(StatusCodes.OK).json({ res: "success", data: events });
};
const getEventsCategorized = async (req, res) => {};
const getStaticCombos = async (req, res) => {};
const getUserEvents = async (req, res) => {};

const getCertificate = async (req, res) => {
  const { uid, eid } = req.params;
  const user = await User.findOne({ _id: uid });
  const event = await Event.findOne({ _id: eid });
  // Create a document
  const doc = new pdfkit();
  // const doc = new PDFDocument();
  // Saving the pdf file in root directory.
  doc.pipe(fs.createWriteStream(`certificate-${user.name}-${event.name}.pdf`));
  doc.image("./certificate.jpg", 0, 0, { width: 620, height: 800 });
  const angle = Math.PI * 28.6;
  doc.rotate(angle, { origin: [300, 240] });
  doc.fontSize(17).text(user.name, 300, 240, {
    width: 300,
    align: "center",
  });
  doc.fontSize(17).text(event.name, 360, 299, {
    width: 210,
    align: "center",
  });
  doc.fontSize(15).text("18", 420, 381, {
    width: 40,
    align: "center",
  });
  doc.end();
  setTimeout(() => {
    var file = fs.createReadStream(
      `./certificate-${user.name}-${event.name}.pdf`
    );
    var stat = fs.statSync(`./certificate-${user.name}-${event.name}.pdf`);
    res.setHeader("Content-Length", stat.size);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=participation_certificate.pdf"
    );
    file.pipe(res);
  }, 1000);
};

const checkDynamicCombo = async (req, res) => {};
const buttonVisibility = async (req, res) => {};
const getUserDetails = async (req, res) => {
  const { uid } = req.params;
  const user = await User.findOne({ _id: uid });
  if (!user) {
    throw new NotFoundError("User not found");
  } else {
    res.status(StatusCodes.OK).json({ res: "success", data: user });
  }
};
const validateUserOtp = async (req, res) => {
  const { otp } = req.body;
  const { uid } = req.params;
  if (!otp) {
    throw new BadRequestError("Please provide otp in the body");
  } else {
    const user = await User.findOne({ _id: uid });
    if (user.otp !== otp) {
      res.status(StatusCodes.OK).json({ res: "failed", data: "Invalid otp" });
    } else {
      res.status(StatusCodes.OK).json({ res: "success", data: "valid otp" });
    }
  }
};

module.exports = {
  getAllEvents,
  getOneEvent,
  getEventsCategorized,
  getUserEvents,
  getStaticCombos,
  checkDynamicCombo,
  buttonVisibility,
  getCertificate,
  getUserDetails,
  validateUserOtp,
};
