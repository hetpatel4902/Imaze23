const User = require("../models/Users");
const Event = require("../models/Event");
const StaticCombo = require("../models/StaticCombo");
const UserEvent = require("../models/UserEvent");
const Combo = require("../models/Combos");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors/index");
const fs = require("fs");
const pdfkit = require("pdfkit");
const bcrypt = require("bcrypt");
const Cultural = require("../models/Cultural");
const FlagshipEvents = require("../models/FlagshipEvents");

//utility functions
const isClashing = async (events) => {
  var data = [];
  let flag = false;
  var result = {};
  for (let i = 0; i < events.length; i++) {
    const event = await Event.findOne({ _id: events[i] });
    const event_day = event.date.substring(0, 2);
    const event_time = event.time;
    const event_name = event.name;
    if (event_day in result) {
      if (event_time.substring(2, 4) === "00") {
        result[event_day][Number(event_time.substring(0, 2)) - 1].push(
          event_name
        );
        result[event_day][Number(event_time.substring(0, 2))].push(event_name);
      } else {
        result[event_day][Number(event_time.substring(0, 2))].push(event_name);
      }
    } else {
      const time_div = {
        8: [],
        9: [],
        10: [],
        11: [],
        12: [],
        13: [],
        14: [],
        15: [],
        16: [],
        17: [],
        18: [],
        19: [],
      };
      result[event_day] = time_div;
      if (event_time.substring(2, 4) === "00") {
        result[event_day][Number(event_time.substring(0, 2)) - 1].push(
          event_name
        );
        result[event_day][Number(event_time.substring(0, 2))].push(event_name);
      } else {
        result[event_day][Number(event_time.substring(0, 2))].push(event_name);
      }
    }
  }
  for (var day in result) {
    let time = result[day];
    for (let t in time) {
      if (time[t].length > 1) {
        data.push(time[t]);
        flag = true;
      }
    }
  }
  return { flag, data };
};

//events
const getAllEvents = async (req, res) => {
  const { search, fields, sort } = req.query;
  var events = await Event.find({});
  var cultural = await Cultural.find({});
  var flagship = await FlagshipEvents.find({});
  var allevents = [...events, ...cultural, ...flagship];
  if (search) {
    events = await Event.find({
      name: { $regex: search, $options: "i" },
    });
    cultural = await Cultural.find({
      name: { $regex: search, $options: "i" },
    });
    flagship = await FlagshipEvents.find({
      name: { $regex: search, $options: "i" },
    });
    allevents = [...events, ...cultural, ...flagship];
  }
  if (sort) {
    allevents = allevents.sort(function (a, b) {
      return b.noOfParticipants - a.noOfParticipants;
    });
  }
  allevents = allevents.splice(0, 10);
  res
    .status(StatusCodes.OK)
    .json({ res: "success", nhits: allevents.length, data: allevents });
};
const getEventsCategorized = async (req, res) => {
  var findEl = "category";
  var events = await Event.find({});
  var cultural = await Cultural.find({});
  var flagship = await FlagshipEvents.find({
    category: ["Ideathon", "Toyothon"],
  });
  var allevents = [...events, ...cultural, ...flagship];
  var groupby = function (xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };
  const result = groupby(allevents, findEl);
  res.status(StatusCodes.OK).json({ res: "success", data: result });
};
const getOneEvent = async (req, res) => {
  const { eid } = req.params;
  const { type } = req.body;
  let event;
  switch (type) {
    case "NORMAL":
      event = await Event.findOne({ _id: eid });
    case "FLAGSHIP":
      event = await FlagshipEvents.findOne({ _id: eid });
    case "CULTURAL":
      event = await Cultural.findOne({ _id: eid });
  }
  if (!event) {
    throw new NotFoundError(
      "there is no event corresponding to provided event id"
    );
  }
  res.status(StatusCodes.OK).json({ res: "success", data: event });
};
const getUserEvents = async (req, res) => {
  const { uid } = req.params;
  const userEvents = await UserEvent.find({
    userId: uid,
    payment_status: "COMPLETED",
  });
  const userCombos = await Combo.find({
    userId: uid,
    payment_status: "COMPLETED",
  });
  const pendingCombos = await Combo.find({
    userId: uid,
    payment_status: "INCOMPLETE",
    payment_mode: "OFFLINE",
  });
  const pendingEvents = await UserEvent.find({
    userId: uid,
    payment_status: "INCOMPLETE",
    payment_mode: "OFFLINE",
  });

  //pending combos
  var combos = [];
  for (let i = 0; i < pendingCombos.length; i++) {
    var temp_combo_array = [];
    const events = pendingCombos[i].event;
    for (let j = 0; j < events.length; j++) {
      const event = await Event.findOne({ _id: events[j] });
      temp_combo_array.push(event);
    }
    let obj = {};
    obj.events = temp_combo_array;
    obj.price = pendingCombos[i].price;
    obj.payment_mode = pendingCombos[i].payment_mode;
    obj.cash_otp = pendingCombos[i].cashotp;
    obj.combo_type = pendingCombos[i].combotype;
    combos.push(obj);
  }
  //pending events
  var individual = [];
  for (let i = 0; i < pendingEvents.length; i++) {
    const event = await Event.findOne({ _id: pendingEvents[i].eventid });
    let obj = {};
    obj.event_details = event;
    obj.price = pendingEvents[i].price;
    obj.payment_mode = pendingEvents[i].payment_mode;
    obj.cash_otp = pendingEvents[i].cashotp;
    obj.payment_status = pendingEvents[i].payment_status;
    individual.push(obj);
  }

  //purchased events
  var event_ids = [];
  for (let i = 0; i < userEvents.length; i++) {
    event_ids.push(userEvents[i].eventid);
  }
  for (let i = 0; i < userCombos.length; i++) {
    let combo_events = userCombos[i].event;
    for (let j = 0; j < combo_events.length; j++) {
      event_ids.push(combo_events[j]);
    }
  }
  var events = [];
  for (let i = 0; i < event_ids.length; i++) {
    const event = await Event.findOne({ _id: event_ids[i] });
    events.push(event);
  }
  res.status(StatusCodes.OK).json({
    res: "success",
    data: { purchased_events: events, pending: { combos, individual } },
  });
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
const checkCombo = async (req, res) => {
  const { events, combotype, price } = req.body;
  const { uid } = req.params;
  var event_ids = [...events];
  //purchased events + incomplete
  const userEvents = await UserEvent.find({
    userId: uid,
    payment_status: ["COMPLETED", "INCOMPLETE"],
  });
  const userCombos = await Combo.find({
    userId: uid,
    payment_status: ["COMPLETED", "INCOMPLETE"],
  });
  for (let i = 0; i < userEvents.length; i++) {
    event_ids.push(userEvents[i].eventid);
  }
  for (let i = 0; i < userCombos.length; i++) {
    let combo_events = userCombos[i].event;
    event_ids = [...event_ids, combo_events];
  }

  //checking for time clashes
  const { flag, data } = await isClashing(events);
  if (!flag) {
    const create_combo = await Combo.create({
      price,
      event: events,
      combotype,
      userId: uid,
      payment_mode: "OFFLINE",
      payment_status: "NEW",
    });
    res
      .status(StatusCodes.OK)
      .json({ res: "success", flag, data: create_combo });
  } else {
    res.status(StatusCodes.OK).json({ res: "success", flag, data });
  }
};
const checkUserEvent = async (req, res) => {
  const { uid } = req.params;
  const { price, eid } = req.body;

  //purchased events + incomplete status wale events
  var events = [];
  const userEvents = await UserEvent.find({
    userId: uid,
    payment_status: ["COMPLETED", "INCOMPLETE"],
  });
  const userCombos = await Combo.find({
    userId: uid,
    payment_status: ["COMPLETED", "INCOMPLETE"],
  });
  for (let i = 0; i < userEvents.length; i++) {
    events.push(userEvents[i].eventid);
  }
  for (let i = 0; i < userCombos.length; i++) {
    let combo_events = userCombos[i].event;
    for (let j = 0; j < combo_events.length; j++) {
      events.push(combo_events[j]);
    }
  }
  events.push(eid);
  const { flag, data } = await isClashing(events);
  if (flag) {
    res.status(StatusCodes.OK).json({ res: "success", flag, data });
  } else {
    const create_event = await UserEvent.create({
      userId: uid,
      eventid: eid,
      price,
      payment_mode: "OFFLINE",
      payment_status: "NEW",
    });
    res
      .status(StatusCodes.OK)
      .json({ res: "success", flag, data: create_event });
  }
};

//certificates
const buttonVisibility = async (req, res) => {
  let { uid, eid } = req.params;
  const event = await Event.findOne({ _id: eid });
  const attendees = event.attendance;
  if (attendees.includes(uid)) {
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
const updateUserDetails = async (req, res) => {
  const { uid } = req.params;
  const user = await User.findOneAndUpdate({ _id: uid }, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(StatusCodes.OK).json({ res: "success", data: user });
};
const validateUserOtp = async (req, res) => {
  const { otp } = req.body;
  const { email } = req.params;
  if (!otp) {
    throw new BadRequestError("Please provide otp in the body");
  } else {
    const user = await User.findOne({ email: email });
    if (user.otp !== otp) {
      res.status(StatusCodes.OK).json({ res: "failed", data: "Invalid otp" });
    } else {
      res.status(StatusCodes.OK).json({ res: "success", data: "valid otp" });
    }
  }
};
const updatepassword = async (req, res) => {
  const { email } = req.params;
  var { password } = req.body;
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  const user = await User.findOneAndUpdate(
    { email: email },
    { password },
    { new: true, runValidators: true, setDefaultsOnInsert: true }
  );
  if (!user) {
    throw new NotFoundError("user not found");
  } else {
    res.status(StatusCodes.OK).json({ res: "success", data: user });
  }
};

//payments
const getPaymentHistory = async (req, res) => {
  const { uid } = req.params;
  const userEvents = await UserEvent.find({
    userId: uid,
    payment_status: "COMPLETED",
  });
  const userCombos = await Combo.find({
    userId: uid,
    payment_status: "COMPLETED",
  });

  var individual_events = [];
  for (let i = 0; i < userEvents.length; i++) {
    const event = await Event.findOne({ _id: userEvents[i].eventid });
    var obj = {};
    obj.event_details = event;
    obj.price = userEvents[i].price;
    obj.payment_mode = userEvents[i].payment_mode;
    individual_events.push(obj);
  }

  var combos = [];
  for (let i = 0; i < userCombos.length; i++) {
    let temp_array = [];
    let events = userCombos[i].event;
    for (let j = 0; j < events.length; j++) {
      const event = await Event.findOne({ _id: events[j] });
      temp_array.push(event);
    }
    const obj = {};
    obj.events = temp_array;
    obj.price = userCombos[i].price;
    obj.payment_mode = userCombos[i].payment_mode;
    obj.combo_type = userCombos[i].combotype;

    combos.push(obj);
  }

  res
    .status(StatusCodes.OK)
    .json({ res: "success", data: { individual_events, combos } });
};
const payOffline = async (req, res) => {
  const { uid } = req.params;
  const { orderId, isCombo } = req.body;

  //generate otp
  const otp = Math.floor(Math.random() * 10000);
  if (isCombo) {
    const combo = await Combo.findOneAndUpdate(
      { userId: uid, _id: orderId },
      { cashotp: otp, payment_mode: "OFFLINE", payment_status: "INCOMPLETE" },
      { new: true }
    );
    res.status(StatusCodes.OK).json({ res: "success", otp: combo.cashotp });
  } else {
    const event = await UserEvent.findOneAndUpdate(
      { userId: uid, _id: orderId },
      { cashotp: otp, payment_mode: "OFFLINE", payment_status: "INCOMPLETE" },
      { new: true }
    );
    res.status(StatusCodes.OK).json({ res: "success", otp: event.cashotp });
  }
};
const payOnline = async (req, res) => {
  const { uid } = req.params;
  const { orderId, isCombo, transId, transUrl } = req.body;
  if (!transId || !transUrl) {
    throw new BadRequestError("Please provide transaction id and image url!!");
    return;
  }
  if (isCombo) {
    const combo = await Combo.findOneAndUpdate(
      { _id: orderId },
      {
        payment_mode: "ONLINE",
        payment_status: "INCOMPLETE",
        transId: transId,
        transaction_image: transUrl,
      },
      { new: true }
    );
    res.status(StatusCodes.OK).json({ res: "success" });
  } else {
    const event = await UserEvent.findOneAndUpdate(
      { userId: uid, _id: orderId },
      {
        payment_mode: "ONLINE",
        payment_status: "INCOMPLETE",
        transId: transId,
        transaction_image: transUrl,
      },
      { new: true }
    );
    res.status(StatusCodes.OK).json({ res: "success" });
  }
};
const purchaseToken = async (req, res) => {
  console.log("purchase");
};
module.exports = {
  getAllEvents,
  getOneEvent,
  getEventsCategorized,
  getUserEvents,
  getStaticCombos,
  checkCombo,
  checkUserEvent,
  buttonVisibility,
  getCertificate,
  getUserDetails,
  updateUserDetails,
  validateUserOtp,
  updatepassword,
  getPaymentHistory,
  payOffline,
  payOnline,
  purchaseToken,
};
