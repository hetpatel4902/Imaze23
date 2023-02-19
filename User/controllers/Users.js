const User = require("../models/Users");
const Event = require("../models/Event");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors/index");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const pdf = require("html-pdf");
const fs = require("fs");

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
  const data = { username: "pratham", ename: "techy ludo", day: "18" };
  const filepathname = __dirname + "/certificate.ejs";
  const htmlstring = fs.readFileSync(filepathname).toString();
  const options = {
    format: "Letter",
    childProcessOptions: {
      env: {
        OPENSSL_CONF: "/dev/null",
      },
    },
  };
  const ejsdata = ejs.render(htmlstring, data);
  setTimeout(() => {
    pdf.create(ejsdata, options).toFile(`certificate.pdf`, (err, response) => {
      if (err) console.log(err);
      console.log("File Generated");
      res.status(200).json("success");
    });
  }, 2000);
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
