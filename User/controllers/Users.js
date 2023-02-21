const User = require("../models/Users");
const Event = require("../models/Event");
const StaticCombo = require("../models/StaticCombo");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors/index");
const fs = require("fs");
const pdfkit = require("pdfkit");

//events 
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
const getEventsCategorized = async (req, res) => {
  var findEl = "category";
  var resp = await Event.find({});
  var groupby = function (xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };
  const result = groupby(resp, findEl);
  res.status(StatusCodes.OK).json({ res: "success", data: result });
};
const getOneEvent = async (req, res) => {
  const { eid } = req.params;
  const event = await Event.findOne({ _id: eid });
  if (!event) {
    throw new NotFoundError(
      "there is no event corresponding to provided event id"
    );
  }
  res.status(StatusCodes.OK).json({ res: "success", data: event });
};
const getUserEvents = async (req, res) => {};


//combos
const getStaticCombos = async (req, res) => {
  var static_combos = await StaticCombo.find({});
  var resp = []
  for (let i = 0; i < static_combos.length; i++) {
    const event_array = static_combos[i].events;
    const obj = {}
    let arr = [];
    for (let j = 0; j < event_array.length; j++) {
      const event = await Event.findOne({ _id: event_array[j] });
      arr.push(event);
    }
    obj.events = arr;
    obj._id = static_combos[i]._id;
    obj.price = static_combos[i].price;
    resp.push(obj);
  }
  
  res.status(StatusCodes.OK).json({ res: "success", data: resp });
};
const checkDynamicCombo = async (req, res) => {};


//certificates
const buttonVisibility = async (req, res) => {};
const getCertificate = async (req, res) => {
  const { uid, eid } = req.params;
  const user = await User.findOne({ _id: uid });
  const event = await Event.findOne({ _id: eid });
  // Create a document
  const doc = new pdfkit();
  // Saving the pdf file in root directory.
  doc.pipe(
    fs.createWriteStream(
      `./certificates/certificate-${user.name}-${event.name}.pdf`
    )
  );
  doc.image("./certificate.jpg", 0, 0, { width: 620, height: 800 });
  const angle = Math.PI * 28.6;
  doc.rotate(angle, { origin: [300, 248] });
  doc
    .fontSize(17)
    .font("./Montserrat/static/Montserrat-BoldItalic.ttf")
    .text(user.name, 300, 244, {
      width: 300,
      align: "center",
    });
  doc.fontSize(17).text(event.name, 360, 302, {
    width: 200,
    align: "center",
  });
  doc.fontSize(15).text("18", 422, 385, {
    width: 24,
    align: "center",
  });
  doc.end();
  setTimeout(() => {
    var file = fs.createReadStream(
      `./certificates/certificate-${user.name}-${event.name}.pdf`
    );
    var stat = fs.statSync(
      `./certificates/certificate-${user.name}-${event.name}.pdf`
    );
    res.setHeader("Content-Length", stat.size);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=participation_certificate.pdf"
    );
    file.pipe(res);
  }, 1000);
};


//user
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
