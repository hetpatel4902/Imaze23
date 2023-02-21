const User = require("../models/Users");
const Event = require("../models/Event");
const StaticCombo = require("../models/StaticCombo");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors/index");
const fs = require("fs");
const pdfkit = require("pdfkit");
const UserEvent = require("../models/UserEvent");

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
const getUserEvents = async (req, res) => {
  const {uid} = req.params;
  const userEvents = UserEvent.find({userId:uid});
  res.status(StatusCodes.OK).json({res:"success",data:userEvents})
};

//combos
const getStaticCombos = async (req, res) => {
  var static_combos = await StaticCombo.find({});
  var resp = [];
  for (let i = 0; i < static_combos.length; i++) {
    const event_array = static_combos[i].events;
    const obj = {};
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
const checkDynamicCombo = async (req, res) => {
  var { events } = req.body;
  let time_div = {};
  for (let i = 8; i <= 19; i++) {
    time_div[i] = [];
  }
  var data = [];
  let flag = false;
  var result = {};
  for (let i = 0; i < events.length; i++) {
    const event = await Event.findOne({ _id: events[i] });
    const event_day = event.date.substring(0, 2);
    const event_time = event.time;
    const event_name = event.name;
    if (event_day in res) {
      if (event_time.substring(2, 4) === "00") {
        result[event_day][Number(event_time.substring(0, 2)) - 1].push(
          event_name
        );
      } else {
        result[event_day][Number(event_time.substring(0, 2))].push(event_name);
      }
    } else {
      result[event_day] = time_div;
      if (event_time.substring(2, 4) === "00") {
        result[event_day][Number(event_time.substring(0, 2)) - 1].push(
          event_name
        );
      } else {
        result[event_day][Number(event_time.substring(0, 2))].push(event_name);
      }
    }
  }
  for (var day in result) {
    let time = result[day]
    for (let t in time) {
      if (time[t].length !=0) {
        data.push(time[t]);
        flag = true;
      }
    }
    }
  
  res.status(StatusCodes.OK).json({res:"success",data:{flag,data}});
};

//certificates
const buttonVisibility = async (req, res) => {
  const { uid, eid } = req.params;
  const event = await Event.findOne({ _id: eid });
  const attendees = event.attendance;
  if (uid in attendees) {
    res.status(StatusCodes.OK).json({ res: "success", data: true });
  } else {
    res.status(StatusCodes.OK).json({ res: "failed", data: false });
  }
};
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
const updatepassword = async (req, res) => {
  const { uid } = req.params;
  const { password } = req.body;
  const user = await User.findOneAndUpdate(
    { _id: uid },
    { password },
    { new: true }
  );
  if (!user) {
    throw new NotFoundError("user not found");
  } else {
    res.status(StatusCodes.OK).json({ res: "success", data: user });
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
  updatepassword,
};
