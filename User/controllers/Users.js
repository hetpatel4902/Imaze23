const User = require("../models/Users");
const Event = require("../models/Event");
const StaticCombo = require("../models/StaticCombo");
const UserEvent = require("../models/UserEvent");
const Combo = require("../models/Combos");
const Sponser = require("../models/Sponser");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors/index");
const fs = require("fs");
const pdfkit = require("pdfkit");
const bcrypt = require("bcrypt");
const Cultural = require("../models/Cultural");
const FlagshipEvents = require("../models/FlagshipEvents");
const s3 = require("../utils/s3");

//time clash check
const isClashing = async (uid, current_event, isCombo, comevents) => {
  var data = [];
  let flag = false;
  var result = {};
  var events = [];
  if (isCombo) {
    for (let i = 0; i < comevents.length; i++) {
      const temp = await Event.findOne({ _id: comevents[i] });
      events.push(temp);
    }
  }
  const userEvents = await UserEvent.find({
    userId: uid,
    category: "NORMAL",
    payment_status: ["COMPLETED", "INCOMPLETE"],
  });
  const userCombos = await Combo.find({
    userId: uid,
    payment_status: ["COMPLETED", "INCOMPLETE"],
  });

  for (let i = 0; i < userEvents.length; i++) {
    if (userEvents[i].category === "NORMAL") {
      let evt = await Event.findOne({
        _id: userEvents[i].eventid,
        type: "SOLO",
      });
      if (evt) events.push(evt);
    }
  }

  for (let i = 0; i < userCombos.length; i++) {
    let combo_events = userCombos[i].event;
    for (let j = 0; j < combo_events.length; j++) {
      const temp = await Event.findOne({ _id: combo_events[j] });
      events.push(temp);
    }
  }

  if (current_event) events.push(current_event);
  //team events
  const user = await User.findOne({ _id: uid });
  const user_teams = user.teams;
  for (let evid in user_teams) {
    if (user_teams[evid].type === "NORMAL") {
      const temp = await Event.findOne({ _id: evid });
      events.push(temp);
    }
  }

  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    if (!event) continue;
    const event_day = event.date.substring(0, 2);
    const event_time = event.time;
    const event_name = event.name;
    if (event_day in result) {
      //3 hour clashing check
      let x =Number(event_time.substring(0,2));
      let count = 0;
      for(x;x<=19;x++){
        if(count==3) break;
        result[event_day][x].push(event_name);
        count++;
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
      let x =Number(event_time.substring(0,2));
      let count = 0;
      for(x;x<=19;x++){
        if(count==3) break;
        result[event_day][x].push(event_name);
        count++;
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
  const { search, sort } = req.query;
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
  var flagship = await FlagshipEvents.find({});
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
  const { type } = req.query;
  let event;
  switch (type) {
    case "NORMAL":
      event = await Event.findOne({ _id: eid });
      break;
    case "FLAGSHIP":
      event = await FlagshipEvents.findOne({ _id: eid });
      break;
    case "CULTURAL":
      event = await Cultural.findOne({ _id: eid });
      break;
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
  });
  const pendingEvents = await UserEvent.find({
    userId: uid,
    payment_status: "INCOMPLETE",
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
    let event;
    switch (pendingEvents[i].category) {
      case "NORMAL":
        event = await Event.findOne({ _id: pendingEvents[i].eventid });
        individual.push({ event, cashotp: pendingEvents[i].cashotp });
        break;
      case "CULTURAL":
        event = await Cultural.findOne({ _id: pendingEvents[i].eventid });
        individual.push({ event, cashotp: pendingEvents[i].cashotp });
        break;
      case "FLAGSHIP":
        event = await FlagshipEvents.findOne({ _id: pendingEvents[i].eventid });
        individual.push({ event, cashotp: pendingEvents[i].cashotp });
        break;
    }
  }

  //purchased solo events -> in combos and normal single events
  var solo_events = [];
  for (let i = 0; i < userEvents.length; i++) {
    let event;
    switch (userEvents[i].category) {
      case "NORMAL":
        event = await Event.findOne({
          type: "SOLO",
          _id: userEvents[i].eventid,
        });
        if (event) {
          solo_events.push(event);
        }
        break;
      case "CULTURAL":
        event = await Cultural.findOne({
          type: "SOLO",
          _id: userEvents[i].eventid,
        });
        if (event) {
          solo_events.push(event);
        }
        break;
      case "FLAGSHIP":
        event = await FlagshipEvents.findOne({
          type: "SOLO",
          _id: userEvents[i].eventid,
        });
        if (event) {
          solo_events.push(event);
        }
        break;
    }
  }
  for (let i = 0; i < userCombos.length; i++) {
    let combo_events = userCombos[i].event;
    for (let j = 0; j < combo_events.length; j++) {
      let event;
      switch (combo_events[i].category) {
        case "NORMAL":
          event = await Event.findOne({
            type: "SOLO",
            _id: combo_events[i].eventid,
          });
          solo_events.push(event);
          break;
        case "CULTURAL":
          event = await Cultural.findOne({
            type: "SOLO",
            _id: combo_events[i].eventid,
          });
          solo_events.push(event);
          break;
        case "FLAGSHIP":
          event = await FlagshipEvents.findOne({
            type: "SOLO",
            _id: combo_events[i].eventid,
          });
          solo_events.push(event);
          break;
      }
    }
  }

  //teams that the user is a part of : whether the user is a team leader or team member
  var team_events = [];
  const user = await User.findOne({ _id: uid });
  const user_teams = user.teams;
  for (let teamevent in user_teams) {
    let team_event = {};
    switch (user_teams[teamevent].type) {
      case "NORMAL":
        team_event.event = await Event.findOne({ _id: teamevent });
        team_event.team_name = user_teams[teamevent].team_name;
        team_events.push(team_event);
        break;
      case "FLAGSHIP":
        team_event.event = await FlagshipEvents.findOne({ _id: teamevent });
        team_event.team_name = user_teams[teamevent].team_name;
        break;
      case "CULTURAL":
        team_event.event = await Cultural.findOne({ _id: teamevent });
        team_event.team_name = user_teams[teamevent].team_name;
        break;
    }
    if (Object.keys(team_event).length !== 0) {
      team_events.push(team_event);
    }
  }

  res.status(StatusCodes.OK).json({
    res: "success",
    data: {
      purchased: { solo_events, team_events },
      pending: { combos, individual },
    },
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

  //checking for time clashes
  const { flag, data } = await isClashing(uid, null, true, events); //uid,current_event,isCombo,events
  if (!flag) {
    // let date = d.getDate()+"-"+(d.getMonth()+1)+"-"+d.getFullYear();
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
      .json({ res: "success", flag: true, data: create_combo });
  } else {
    res.status(StatusCodes.OK).json({ res: "success", flag: false, data });
  }
};
const participateNormalSolo = async (req, res) => {
  const { uid, eid, price } = req.body;
  const event = await Event.findOne({ _id: eid });

  const { flag, data } = await isClashing(uid, event, false);
  if (flag) {
    res.status(StatusCodes.OK).json({ res: "success", flag: false, data });
  } else {
    const create_event = await UserEvent.create({
      userId: uid,
      eventid: eid,
      price: price,
      payment_mode: "OFFLINE",
      payment_status: "NEW",
      category: "NORMAL",
    });
    res
      .status(StatusCodes.OK)
      .json({ res: "success", flag: true, data: create_event });
  }
};

//certificates
const buttonVisibility = async (req, res) => {
  let { uid, eid } = req.params;
  const { type } = req.query;
  let event;
  switch (type) {
    case "NORMAL":
      event = await Event.findOne({ _id: eid });
      if (event.type === "SOLO") {
        const attendees = event.attendance;
        if (attendees.includes(uid)) {
          res.status(StatusCodes.OK).json({ res: "success", data: true });
        } else {
          res.status(StatusCodes.OK).json({ res: "failed", data: false });
        }
      }
      if (event.type === "GROUP") {
        const attendees = event.attendance;
        for (let team in attendees) {
          if (attendees[team].team_leader === uid) {
            res.status(StatusCodes.OK).json({ res: "success", data: true });
            return;
          } else {
            if (attendees[team].members.includes(uid)) {
              res.status(StatusCodes.OK).json({ res: "success", data: true });
              return;
            }
          }
        }
        res.status(StatusCodes.OK).json({ res: "failed", data: false });
      }
      break;

    case "FLAGSHIP":
      event = await FlagshipEvents.findOne({ _id: eid });
      if (event.type === "SOLO") {
        const attendees = event.attendance;
        if (attendees.includes(uid)) {
          res.status(StatusCodes.OK).json({ res: "success", data: true });
          return;
        } else {
          res.status(StatusCodes.OK).json({ res: "failed", data: false });
          return;
        }
      }
      if (event.type === "GROUP") {
        const attendees = event.attendance;
        for (let team in attendees) {
          if (attendees[team].team_leader === uid) {
            res.status(StatusCodes.OK).json({ res: "success", data: true });
            return;
          } else {
            if (attendees[team].members.includes(uid)) {
              res.status(StatusCodes.OK).json({ res: "success", data: true });
              return;
            }
          }
        }
        res.status(StatusCodes.OK).json({ res: "failed", data: false });
      }
      break;

    case "CULTURAL":
      event = await Cultural.findOne({ _id: eid });
      if (event.type === "SOLO") {
        const attendees = event.participants;
        if (attendees.includes(uid)) {
          res.status(StatusCodes.OK).json({ res: "success", data: true });
          return;
        } else {
          res.status(StatusCodes.OK).json({ res: "failed", data: false });
          return;
        }
      }
      if (event.type === "GROUP") {
        const attendees = event.participants;
        for (let team in attendees) {
          if (attendees[team].team_leader === uid) {
            res.status(StatusCodes.OK).json({ res: "success", data: true });
            return;
          } else {
            if (attendees[team].members.includes(uid)) {
              res.status(StatusCodes.OK).json({ res: "success", data: true });
              return;
            }
          }
        }
        res.status(StatusCodes.OK).json({ res: "failed", data: false });
      }
      break;
  }
};
const getCertificate = async (req, res) => {
  const { uid, eid } = req.params;
  const { type } = req.query;
  const user = await User.findOne({ _id: uid });
  let event;
  let image_url;
  let show_event_name = true;
  let t1_r, t1_c, t1_w;
  let t2_r, t2_c, t2_w;
  switch (type) {
    case "NORMAL":
      event = await Event.findOne({ _id: eid });
      if (event.category === "Tech") {
        image_url = "Tech";
        t1_r = 280;
        t1_c = 239;
        t1_w = 445;

        t2_r = 265;
        t2_c = 313;
        t2_w = 365;
      }
      if (event.category === "NonTech") {
        image_url = "NonTech";
        t1_r = 280;
        t1_c = 239;
        t1_w = 445;

        t2_r = 370;
        t2_c = 309;
        t2_w = 335;
      }
      if (event.category === "Workshop") {
        image_url = "Workshop";
        t1_r = 280;
        t1_c = 239;
        t1_w = 445;

        t2_r = 227;
        t2_c = 309;
        t2_w = 445;
      }
      break;
    case "FLAGSHIP":
      event = await FlagshipEvents.findOne({ _id: eid });
      image_url = "FLAGSHIP";
      t1_r = 280;
      t1_c = 239;
      t1_w = 445;

      t2_r = 265;
      t2_c = 313;
      t2_w = 365;
      break;
    case "CULTURAL":
      event = await Cultural.findOne({ _id: eid });
      image_url = "CULTURAL";
      t1_r = 280;
      t1_c = 239;
      t1_w = 430;
      show_event_name = false;
      break;
  }

  // Create a document
  const doc = new pdfkit();
  doc.pipe(
    fs.createWriteStream(`./certificates/${user.name}-${event.name}.pdf`)
  );
  doc.image(`./templates/${image_url}.jpg`, 0, 0, { width: 620, height: 800 });
  const angle = Math.PI * 28.7;
  doc.rotate(angle, { origin: [300, 248] });
  doc
    .fontSize(31)
    .font("./Montserrat/static/Montserrat-Bold.ttf")
    .text(user.name, t1_r, t1_c, {
      width: t1_w,
      align: "center",
    });
  if (show_event_name) {
    doc.fontSize(22).text(event.name, t2_r, t2_c, {
      width: t2_w,
      align: "center",
    });
  }
  doc.end();
  setTimeout(async () => {
    try {
      var file = fs.createReadStream(
        `./certificates/${user.name}-${event.name}.pdf`
      );
      let url = await s3.uploadPdf(
        `${user.name}-${event.name}.pdf`,
        file,
        "certificate"
      );
      fs.unlink(`./certificates/${user.name}-${event.name}.pdf`, (err) => {
        if (err) console.log(err);
      });
      res.status(StatusCodes.OK).json({ res: "success", data: url });
    } catch (err) {
      console.log("certificate upload error", err);
      throw new BadRequestError("could not generate certificate");
    }
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
    if (String(otp) !== String(user.otp)) {
      throw new BadRequestError("Invalid otp");
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
    let event;
    switch (userEvents[i].category) {
      case "NORMAL":
        event = await Event.findOne({ _id: userEvents[i].eventid });
        individual_events.push({ event, receipt: userEvents[i].receipt_url });
        break;
      case "FLAGSHIP":
        event = await FlagshipEvents.findOne({ _id: userEvents[i].eventid });
        individual_events.push({ event, receipt: userEvents[i].receipt_url });
        break;
      case "CULTURAL":
        event = await Cultural.findOne({ _id: userEvents[i].eventid });
        individual_events.push({ event, receipt: userEvents[i].receipt_url });
        break;
    }
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
    obj.receipt = userCombos[i].receipt_url;

    combos.push(obj);
  }

  res
    .status(StatusCodes.OK)
    .json({ res: "success", data: { individual_events, combos } });
};
const payOffline = async (req, res) => {
  const { uid } = req.params;
  const { orderId, isCombo } = req.body;

  const d = new Date();
  let date = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
  //generate otp
  const otp = Math.floor(Math.random() * 10000);
  if (isCombo) {
    const combo = await Combo.findOneAndUpdate(
      { userId: uid, _id: orderId },
      {
        cashotp: otp,
        payment_mode: "OFFLINE",
        payment_status: "INCOMPLETE",
        date,
      },
      { new: true }
    );
    res.status(StatusCodes.OK).json({ res: "success", otp: combo.cashotp });
  } else {
    const event = await UserEvent.findOneAndUpdate(
      { userId: uid, _id: orderId },
      {
        cashotp: otp,
        payment_mode: "OFFLINE",
        payment_status: "INCOMPLETE",
        date,
      },
      { new: true }
    );
    res.status(StatusCodes.OK).json({ res: "success", otp: event.cashotp });
  }
};
const payOnline = async (req, res) => {
  const { uid } = req.params;
  let { orderId, isCombo, transId, transUrl } = req.body;
  if (!transId || !transUrl) {
    throw new BadRequestError("Please provide transaction id and image url!!");
  }
  try {
    transUrl = await s3.uploadImage(transId, transUrl, "payment");
  } catch (err) {
    console.log("pay online:", err);
    throw new BadRequestError("screenshot upload failed!");
  }
  const d = new Date();
  let date = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
  if (isCombo) {
    const combo = await Combo.findOneAndUpdate(
      { _id: orderId },
      {
        payment_mode: "ONLINE",
        payment_status: "INCOMPLETE",
        transId: transId,
        transaction_image: transUrl,
        date,
      },
      { new: true }
    );
    const combo_events = combo.event;
    let add_coins = 0;
    for (let i = 0; i < combo_events.length; i++) {
      const temp = await Event.findOne({ _id: combo_events[i] });
      //add participant, increase no of participants, check is available , add coins
      temp.participants.push(uid);
      temp.noOfParticipants = temp.noOfParticipants + 1;
      if (temp.noOfParticipants === temp.maxparticipants) {
        temp.isAvailable = false;
      }
      const upd = await Event.findOneAndUpdate(
        { _id: combo_events[i] },
        { temp },
        { new: true }
      );
      switch (temp.category) {
        case "Tech":
          add_coins += 60;
          break;
        case "NonTech":
          add_coins += 40;
          break;
        case "Workshop":
          add_coins += 80;
          break;
      }
    }
    const student = await User.findOne({ _id: uid });
    const upd_student = await User.findOneAndUpdate(
      { _id: uid },
      {
        coins: student.coins + add_coins,
      }
    );
    res.status(StatusCodes.OK).json({ res: "success", data: upd_student });
  } else {
    //check the category of the event, add participants , increase number of participants, check isAvailable,add coins to all the members if group event

    const evt = await UserEvent.findOne({ userId: uid, _id: orderId });
    if (!evt) {
      throw new BadRequestError("This order id and user id does not match!");
    }
    //checking the category
    switch (evt.category) {
      case "NORMAL":
        const normal_event = await Event.findOne({ _id: evt.eventid });
        switch (normal_event.type) {
          case "SOLO":
            normal_event.noOfParticipants = normal_event.noOfParticipants + 1;
            normal_event.participants.push(uid);
            if (
              normal_event.noOfParticipants === normal_event.maxparticipants
            ) {
              normal_event.isAvailable = false;
            }
            let add_coins = 0;
            //update event
            const upd_event = await Event.findOneAndUpdate(
              { _id: evt.eventid },
              normal_event,
              { new: true }
            );

            //adding respective coins to student's profile
            switch (normal_event.category) {
              case "Tech":
                add_coins += 60;
                break;
              case "NonTech":
                add_coins += 40;
                break;
              case "Workshop":
                add_coins += 80;
                break;
            }
            const student = await User.findOne({ _id: uid });
            const upd_student = await User.findOneAndUpdate(
              { _id: uid },
              {
                coins: student.coins + add_coins,
              }
            );
            const usrevent_solo = await UserEvent.findOneAndUpdate(
              { userId: uid, _id: orderId },
              {
                payment_mode: "ONLINE",
                payment_status: "INCOMPLETE",
                transId: transId,
                transaction_image: transUrl,
                date,
              },
              { new: true }
            );
            res
              .status(StatusCodes.OK)
              .json({ res: "success", data: upd_student });
            break;

          case "GROUP":
            const team = evt.team;
            //adding participants to the event
            normal_event.participants.push(team);
            normal_event.noOfParticipants = normal_event.noOfParticipants + 1;
            if (
              normal_event.noOfParticipants === normal_event.maxparticipants
            ) {
              normal_event.isAvailable = false;
            }
            const upd_event_group = await Event.findOneAndUpdate(
              { _id: evt.eventid },
              normal_event
            );

            let add_coins_group = 0;
            //adding coins to all the team members and adding team to teams
            //adding respective coins to student's profile
            switch (normal_event.category) {
              case "Tech":
                add_coins_group += 60;
                break;
              case "NonTech":
                add_coins_group += 40;
                break;
              case "Workshop":
                add_coins_group += 80;
                break;
            }
            //team leader
            const group_student = await User.findOne({ _id: uid });
            let team_obj = group_student.teams;
            team_obj[evt.eventid] = evt.team;
            const upd_group_student = await User.findOneAndUpdate(
              { _id: uid },
              { coins: group_student.coins + add_coins_group, teams: team_obj },
              { new: true }
            );
            //team members
            for (let i = 0; i < team.members.length; i++) {
              const group_student = await User.findOne({
                _id: team.members[i],
              });
              let team_obj = group_student.teams;
              team_obj[evt.eventid] = evt.team;
              const upd_group_student = await User.findOneAndUpdate(
                { _id: team.members[i] },
                {
                  coins: group_student.coins + add_coins_group,
                  teams: team_obj,
                },
                { new: true }
              );
            }
            const usrevent_group = await UserEvent.findOneAndUpdate(
              { userId: uid, _id: orderId },
              {
                payment_mode: "ONLINE",
                payment_status: "INCOMPLETE",
                transId: transId,
                transaction_image: transUrl,
                date,
              },
              { new: true }
            );
            res
              .status(StatusCodes.OK)
              .json({ res: "success", data: group_student });
            break;
        }
        break;

      case "FLAGSHIP":
        //there can be 2 categories : solo and group
        const flagship_event = await FlagshipEvents.findOne({
          _id: evt.eventid,
        });
        switch (flagship_event.type) {
          case "SOLO":
            //adding participants
            flagship_event.noOfParticipants =
              flagship_event.noOfParticipants + 1;
            flagship_event.participants.push(uid);
            if (
              flagship_event.noOfParticipants === flagship_event.maxparticipants
            ) {
              flagship_event.isAvailable = false;
            }
            const updevent = await FlagshipEvents.findOneAndUpdate(
              { _id: evt.eventid },
              flagship_event
            );

            //adding coins
            const student = await User.findOne({ _id: uid });
            const upd_student = await User.findOneAndUpdate(
              { _id: uid },
              { coins: student.coins + 80 }
            );
            const usrevent_solo = await UserEvent.findOneAndUpdate(
              { userId: uid, _id: orderId },
              {
                payment_mode: "ONLINE",
                payment_status: "INCOMPLETE",
                transId: transId,
                transaction_image: transUrl,
                date,
              },
              { new: true }
            );
            res
              .status(StatusCodes.OK)
              .json({ res: "success", data: upd_student });
            break;

          case "GROUP":
            const team = evt.team;
            //adding participants to the event
            flagship_event.participants.push(team);
            flagship_event.noOfParticipants =
              flagship_event.noOfParticipants + 1;
            if (
              flagship_event.noOfParticipants === flagship_event.maxparticipants
            ) {
              flagship_event.isAvailable = false;
            }
            const upd_event = await FlagshipEvents.findOneAndUpdate(
              { _id: evt.eventid },
              flagship_event
            );

            //adding coins to all the team members and adding team to teams
            //team leader
            const group_student = await User.findOne({ _id: uid });
            let team_obj = group_student.teams;
            team_obj[evt.eventid] = evt.team;
            const upd_group_student = await User.findOneAndUpdate(
              { _id: uid },
              { coins: group_student.coins + 80, teams: team_obj },
              { new: true }
            );
            //team members
            for (let i = 0; i < team.members.length; i++) {
              const group_student = await User.findOne({
                _id: team.members[i],
              });
              let team_obj = group_student.teams;
              team_obj[evt.eventid] = evt.team;
              const upd_group_student = await User.findOneAndUpdate(
                { _id: team.members[i] },
                { coins: group_student.coins + 80, teams: team_obj },
                { new: true }
              );
            }
            const usrevent_group = await UserEvent.findOneAndUpdate(
              { userId: uid, _id: orderId },
              {
                payment_mode: "ONLINE",
                payment_status: "INCOMPLETE",
                transId: transId,
                transaction_image: transUrl,
                date,
              },
              { new: true }
            );
            res
              .status(StatusCodes.OK)
              .json({ res: "success", data: group_student });
            break;
        }
        break;

      case "CULTURAL":
        //there can be 2 categories : solo and group
        const cultural_event = await Cultural.findOne({
          _id: evt.eventid,
        });
        switch (cultural_event.type) {
          case "SOLO":
            //adding participants
            cultural_event.noOfParticipants =
              cultural_event.noOfParticipants + 1;
            cultural_event.participants.push(uid);
            if (
              cultural_event.noOfParticipants === cultural_event.maxparticipants
            ) {
              cultural_event.isAvailable = false;
            }
            const updevent = await Cultural.findOneAndUpdate(
              { _id: evt.eventid },
              cultural_event
            );

            //adding coins
            const student = await User.findOne({ _id: uid });
            const upd_student = await User.findOneAndUpdate(
              { _id: uid },
              { coins: student.coins + 60 }
            );
            const usrevent_solo = await UserEvent.findOneAndUpdate(
              { userId: uid, _id: orderId },
              {
                payment_mode: "ONLINE",
                payment_status: "INCOMPLETE",
                transId: transId,
                transaction_image: transUrl,
                date,
              },
              { new: true }
            );
            res
              .status(StatusCodes.OK)
              .json({ res: "success", data: upd_student });
            break;

          case "GROUP":
            const team = evt.team;
            //adding participants to the event
            cultural_event.participants.push(team);
            cultural_event.noOfParticipants =
              cultural_event.noOfParticipants + 1;
            if (
              cultural_event.noOfParticipants === cultural_event.maxparticipants
            ) {
              cultural_event.isAvailable = false;
            }
            const upd_event = await Cultural.findOneAndUpdate(
              { _id: evt.eventid },
              cultural_event
            );

            //adding coins to all the team members and adding team to teams
            //team leader
            const group_student = await User.findOne({ _id: uid });
            let team_obj = group_student.teams;
            team_obj[evt.eventid] = evt.team;
            const upd_group_student = await User.findOneAndUpdate(
              { _id: uid },
              { coins: group_student.coins + 60, teams: team_obj },
              { new: true }
            );
            //team members
            for (let i = 0; i < team.members.length; i++) {
              const group_student = await User.findOne({
                _id: team.members[i],
              });
              let team_obj = group_student.teams;
              team_obj[evt.eventid] = evt.team;
              const upd_group_student = await User.findOneAndUpdate(
                { _id: team.members[i] },
                { coins: group_student.coins + 60, teams: team_obj },
                { new: true }
              );
            }
            const usrevent_group = await UserEvent.findOneAndUpdate(
              { userId: uid, _id: orderId },
              {
                payment_mode: "ONLINE",
                payment_status: "INCOMPLETE",
                transId: transId,
                transaction_image: transUrl,
                date,
              },
              { new: true }
            );
            res
              .status(StatusCodes.OK)
              .json({ res: "success", data: group_student });

            break;
        }
        break;
    }
  }
};
const purchaseToken = async (req, res) => {
  const { Concert, HappyStreet } = req.body;
  const { uid } = req.params;
  const user = await User.findOne({ _id: uid });
  if (!user) {
    throw new BadRequestError("User does not exists!");
  } else {
    const balance = user.coins;
    const buy = Concert * 100 + HappyStreet * 20;
    if (balance - buy < 0) {
      res
        .status(StatusCodes.OK)
        .json({ res: "success", flag: false, data: "Not enough balance" });
    } else {
      const upd = await User.findOneAndUpdate(
        { _id: uid },
        {
          tokens: user.tokens + HappyStreet,
          concertToken: user.concertToken + Concert,
          coins: balance - buy,
        },
        { new: true }
      );
      res
        .status(StatusCodes.OK)
        .json({ res: "success", flag: true, data: upd });
    }
  }
};

const getList = async (req, res) => {
  const { enrolment, eid } = req.query;
  let allUsers = await User.find({
    enrolment: { $regex: enrolment, $options: "i" },
  });
  allUsers = allUsers.filter((user) => {
    return !(eid in user.teams);
  });
  res
    .status(StatusCodes.OK)
    .json({ res: "success", nhits: allUsers.length, data: allUsers });
};

//cultural
const participateSolo = async (req, res) => {
  const { eid, uid, price } = req.body;
  const event = await Cultural.findOne({ _id: eid });
  const participants = event.participants;
  let flag = true;
  //checking if the user has already registered
  for (let i = 0; i < participants.length; i++) {
    if (participants[i] === uid) {
      flag = false;
      break;
    }
  }
  if (!flag) {
    res.status(StatusCodes.OK).json({
      res: "success",
      flag,
      data: "You have already registered in this event",
    });
  } else {
    const temp = await UserEvent.create({
      userId: uid,
      eventid: eid,
      price: price,
      payment_mode: "OFFLINE",
      payment_status: "NEW",
      category: "CULTURAL",
    });
    res.status(StatusCodes.OK).json({ res: "success", flag, data: temp });
  }
};
const participateCulturalGroup = async (req, res) => {
  const { uid, eid } = req.body;
  const user = await User.findOne({ _id: uid });
  const user_teams = user.teams;

  if (eid in user_teams) {
    res.status(StatusCodes.OK).json({
      res: "success",
      flag: false,
      data: "You are already in a team",
      team: user_teams[eid],
    });
  } else {
    res.status(StatusCodes.OK).json({ res: "success", flag: true });
  }
};

const participateFlagshipGroup = async (req, res) => {
  const { uid, eid } = req.body;
  const user = await User.findOne({ _id: uid });
  const user_teams = user.teams;
  if (eid in user_teams) {
    res.status(StatusCodes.OK).json({
      res: "success",
      flag: false,
      data: "You are already in a team",
      team: user_teams[eid],
    });
  } else {
    res.status(StatusCodes.OK).json({ res: "success", flag: true });
  }
};

const submitGroup = async (req, res) => {
  const { uid, team_name, eid, members, price } = req.body;
  const event = await Cultural.findOne({ _id: eid });
  const participants = event.participants;
  let team_name_flag = false;
  let team_leader_flag = false;
  let team_member_flag = false;
  let member = null;
  let team = null;
  //checking if the team name already exists
  ///checking if the team leader is already in a team
  for (let i = 0; i < participants.length; i++) {
    if (participants[i].team_name === team_name) {
      team_name_flag = true;
      break;
    }
    if (participants[i].team_leader === uid) {
      team_leader_flag = true;
      team = participants[i];
      break;
    }
    if (participants[i].members.includes(uid)) {
      team_leader_flag = true;
      team = participants[i];
      break;
    }
  }
  //checking if member is a part of other teams
  for (let i = 0; i < members.length; i++) {
    const mem = await User.findOne({ _id: members[i] });
    if (eid in mem.teams) {
      team_member_flag = true;
      member = mem;
      break;
    }
  }
  if (team_name_flag) {
    res
      .status(StatusCodes.OK)
      .json({ res: "success", flag: false, data: "Team name already exists!" });
  } else if (team_leader_flag) {
    res.status(StatusCodes.OK).json({
      res: "success",
      flag: false,
      data: "Team leader is already in a team!",
      team: team,
    });
  } else if (team_member_flag) {
    res.status(StatusCodes.OK).json({
      res: "success",
      flag: false,
      data: "Team member is already in a team",
      member,
    });
  } else {
    const obj = {
      team_name: team_name,
      team_leader: uid,
      members: members,
      type: "CULTURAL",
    };

    const temp = await UserEvent.create({
      userId: uid,
      eventid: eid,
      price: price,
      payment_mode: "OFFLINE",
      payment_status: "NEW",
      category: "CULTURAL",
      team: obj,
    });
    res.status(StatusCodes.OK).json({ res: "success", flag: true, data: temp });
  }
};

//flagship
const submitFlagship = async (req, res) => {
  let {
    uid,
    team_name,
    eid,
    members,
    leader_ID,
    poster_url,
    project_title,
    price,
  } = req.body;
  const event = await FlagshipEvents.findOne({ _id: eid });
  const participants = event.participants;
  let team_name_flag = false;
  let team_leader_flag = false;
  let team_member_flag = false;
  let member = null;
  //checking if the team name already exists
  ///checking if the team leader is already in a team
  for (let i = 0; i < participants.length; i++) {
    if (participants[i].team_name === team_name) {
      team_name_flag = true;
      break;
    }
    if (participants[i].team_leader === uid) {
      team_leader_flag = true;
      break;
    }
    if (uid in participants[i].members) {
      team_leader_flag = true;
      break;
    }
  }
  //checking if member is a part of other teams
  for (let i = 0; i < members.length; i++) {
    const mem = await User.findOne({ _id: members[i] });
    if (eid in mem.teams) {
      team_member_flag = true;
      member = mem;
      break;
    }
  }
  if (team_name_flag) {
    res
      .status(StatusCodes.OK)
      .json({ res: "success", flag: false, data: "Team name already exists!" });
  } else if (team_leader_flag) {
    res.status(StatusCodes.OK).json({
      res: "success",
      flag: false,
      data: "Team leader is already in a team!",
    });
  } else if (team_member_flag) {
    res.status(StatusCodes.OK).json({
      res: "success",
      flag: false,
      data: "Team member is already in a team",
      member,
    });
  } else {
    let obj;
    try {
      if (poster_url && leader_ID) {
        poster_url = await s3.uploadImage(
          team_name + "-poster",
          poster_url,
          "team"
        );
        leader_ID = await s3.uploadImage(
          team_name + "-leaderID",
          leader_ID,
          "team"
        );
        obj = {
          team_name: team_name,
          team_leader: uid,
          members: members,
          leader_ID,
          poster_url,
          project_title,
          type: "FLAGSHIP",
        };
      } else {
        obj = {
          team_name: team_name,
          team_leader: uid,
          members: members,
          type: "FLAGSHIP",
        };
      }

      const temp = await UserEvent.create({
        userId: uid,
        eventid: eid,
        price: price,
        payment_mode: "OFFLINE",
        payment_status: "NEW",
        category: "FLAGSHIP",
        team: obj,
      });
      res
        .status(StatusCodes.OK)
        .json({ res: "success", flag: true, data: temp });
    } catch (err) {
      console.log(err);
      res
        .status(StatusCodes.EXPECTATION_FAILED)
        .json({ res: "failed", data: err });
    }
  }
};
const registerSoloFlagship = async (req, res) => {
  const { uid, eid } = req.body;
  const event = await FlagshipEvents.findOne({ _id: eid });
  event.participants.push(uid);
  const upd = await FlagshipEvents.findOneAndUpdate(
    { _id: eid },
    { participants: event.participants },
    { new: true }
  );
  const d = new Date();
  let date = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear();
  const create_event = await UserEvent.create({
    userId: uid,
    eventid: eid,
    price: 0,
    date,
    payment_status: "COMPLETED",
    payment_mode: "OFFLINE",
    category: "FLAGSHIP",
  });
  res.status(StatusCodes.OK).json({ res: "success", data: create_event });
};

const participateFlagshipSolo = async (req, res) => {
  const { uid, eid, price } = req.body;
  const user_event = await UserEvent.create({
    userId: uid,
    eventid: eid,
    payment_status: "NEW",
    payment_mode: "OFFLINE",
    category: "FLAGSHIP",
    price: price,
  });
  res
    .status(StatusCodes.OK)
    .json({ res: "success", flag: true, data: user_event });
};

const participateNormalGroup = async (req, res) => {
  const { eid, uid } = req.body;
  const event = await Event.findOne({ _id: eid });
  const user = await User.findOne({ _id: uid });

  const { flag, data } = isClashing(uid, event, false);
  //if clashing
  if (flag) {
    res.status(StatusCodes.OK).json({ res: "success", flag: false, data });
    return;
  } else {
    //check for valorant and bgmi
    const user_teams = user.teams;
    for (let evid in user_teams) {
      if (user_teams[evid].type === "NORMAL") {
        const temp = await Event.findOne({ _id: evid });
        if (temp.name === "BGMI" && event.name === "Valorant") {
          res.status(StatusCodes.OK).json({
            res: "success",
            flag: false,
            data: "You can only participate in either Valorant or BGMI!",
          });
          return;
        }
        if (temp.name === "Valorant" && event.name === "BGMI") {
          res.status(StatusCodes.OK).json({
            res: "success",
            flag: false,
            data: "You can only participate in either Valorant or BGMI!",
          });
          return;
        }
      }
    }
    //check if the student is already in a team for this event
    if (eid in user.teams) {
      res.status(StatusCodes.OK).json({
        res: "success",
        flag: false,
        data: "You are already in a team!",
      });
    } else {
      res.status(StatusCodes.OK).json({ res: "success", flag: true });
    }
  }
};
const submitNormalGroup = async (req, res) => {
  const { eid, team_name, uid, members, price } = req.body;
  const event = await Event.findOne({ _id: eid });
  const participants = event.participants;
  //checking for same team name
  for (let i = 0; i < participants.length; i++) {
    if (participants[i].team_name === team_name) {
      res.status(StatusCodes.OK).json({
        res: "success",
        flag: false,
        data: "Team name already exists!",
      });
      return;
    }
  }

  //team
  const team_obj = {
    team_name: team_name,
    team_leader: uid,
    members: members,
  };
  const create_event = await UserEvent.create({
    userId: uid,
    eventid: eid,
    payment_mode: "OFFLINE",
    payment_status: "NEW",
    price: price,
    category: "NORMAL",
    team: team_obj,
  });
  res
    .status(StatusCodes.OK)
    .json({ res: "success", flag: true, data: create_event });
};

const uploadSponser = async (req, res) => {
  const { img } = req.body;
  try {
    let url = await s3.uploadImage(
      Math.floor(Math.random() * 100),
      img,
      "sponser"
    );
    const sponsor = await Sponser.create({ url });
    res.status(StatusCodes.OK).json({ res: "success", data: sponsor });
  } catch (err) {
    console.log("sponser image", err);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ res: "failed", data: "could not upload" });
  }
};

const getsponser = async (req, res) => {
  const sponsors = await Sponser.find({});
  if (!sponsors) {
    throw new BadRequestError("no sponsors");
  }
  res.status(StatusCodes.OK).json({ res: "success", data: sponsors });
};

const test = async (req, res) => {
  const { orderId, type } = req.query;
  let result = s3.generateReceipt(orderId, type);
  if (result) {
    res.status(200).json("success");
  } else {
    res.status(200).json("success");
  }
};

module.exports = {
  test,
  getAllEvents,
  getOneEvent,
  getEventsCategorized,
  getUserEvents,
  getStaticCombos,
  checkCombo,
  participateNormalSolo,
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
  getList,
  participateSolo,
  participateCulturalGroup,
  submitGroup,
  participateFlagshipGroup,
  submitFlagship,
  registerSoloFlagship,
  participateFlagshipSolo,
  participateNormalGroup,
  submitNormalGroup,
  uploadSponser,
  getsponser,
};
