require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

// extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");

//connectDB
const connectDB = require("./db/connect");

//middleware
const authmiddleware = require("./middleware/authmiddleware");

// routers
const userRouter = require("./routes/userRouter");
const leadRoute = require("./routes/LeadRoute");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const Users = require("./models/Users");
const Event = require("./models/Event");
const Cultural = require("./models/Cultural");
const FlagshipEvents = require("./models/FlagshipEvents");
const Leads = require("./models/Leads");
const UserEvents = require("./models/UserEvent");
const Combos = require("./models/Combos");
const s3 = require("./utils/s3");

app.use(express.static(`${__dirname}/public`));
app.use(express.json({ limit: "50mb" }));
app.use(helmet());
app.use(cors());
app.use(xss());
const pdfkit = require("pdfkit");
const fs = require("fs");
const UserEvent = require("./models/UserEvent");

//routes user
app.get("/receipt", async (req, res) => {
  const { orderId, type } = req.query;
  let userId;
  let category;
  let event_ids = [];
  let transId;
  let amount;
  let tax = 0;
  let date;
  let event_type ;
  if (type === "combo") {
    const combo = await Combos.findOne({ _id: orderId });
    transId = combo.transId;
    event_ids = combo.event;
    userId = combo.userId;
    amount = combo.price;
    date = combo.date;
    event_type = "Combo"
    category = "NORMAL";
  }
  if (type === "userevent") {
    const usrevent = await UserEvent.findOne({ _id: orderId });
    transId = usrevent.transId;
    event_ids.push(usrevent.eventid);
    userId = usrevent.userId;
    amount = usrevent.price;
    category = usrevent.category;
    event_type = "Single"
    date = usrevent.date;
  }
  const user = await Users.findOne({ _id: userId });

  const doc = new pdfkit({ size: "A7" });
  doc.pipe(fs.createWriteStream(`./receipts/${transId}.pdf`));
  doc.image(`./templates/LetterHead.jpg`, 0, 0, { width: 210, height: 300 });

  //name
  doc
    .fontSize(7)
    .font("./Montserrat/static/Montserrat-Bold.ttf")
    .text(user.name, 5, 70, {
      width: 60,
      height: 20,
      valign: "center",
      align: "center",
    });

  //invoice number
  doc
    .fontSize(7)
    .font("./Montserrat/static/Montserrat-Bold.ttf")
    .text("1069", 75, 70, {
      width: 60,
      height: 15,
      valign: "center",
      align: "center",
    });

  //invoice total
  doc
    .fontSize(7)
    .font("./Montserrat/static/Montserrat-Bold.ttf")
    .text(`₹ ${amount}`, 150, 70, {
      width: 60,
      height: 15,
      valign: "center",
      align: "center",
    });

  //date of issue
  doc
    .fontSize(7)
    .font("./Montserrat/static/Montserrat-Bold.ttf")
    .text(date, 75, 90, {
      width: 60,
      height: 15,
      valign: "center",
      align: "center",
    });

  
  doc
    .fontSize(7)
    .font("./Montserrat/static/Montserrat-Bold.ttf")
    .text(amount, 165, 120, {
      width: 40,
      height: 20,
      valign: "center",
      align: "center",
    });
  
  doc
    .fontSize(7)
    .font("./Montserrat/static/Montserrat-Bold.ttf")
    .text(event_type, 115, 120, {
      width: 40,
      height: 20,
      valign: "center",
      align: "center",
    });

  for (let i = 0; i < event_ids.length; i++) {
    let event;
    switch (category) {
      case "NORMAL":
        event = await Event.findOne({ _id: event_ids[i] });
        doc
          .fontSize(7)
          .font("./Montserrat/static/Montserrat-Bold.ttf")
          .text(event.name, 5, 120 + 20 * i, {
            width: 110,
            height: 20,
            valign: "center",
            align: "center",
          });
        doc.rect(5, 120 + 20 * i, 110, 20).stroke();
        break;

      case "CULTURAL":
        event = await Cultural.findOne({ _id: event_ids[i] });
        doc
          .fontSize(7)
          .font("./Montserrat/static/Montserrat-Bold.ttf")
          .text(event.name, 5, 120 + 20 * i, {
            width: 110,
            height: 20,
            valign: "center",
            align: "center",
          });
        doc.rect(5, 120 + 20 * i, 110, 20).stroke();
        break;

      case "FLAGSHIP":
        event = await FlagshipEvents.findOne({ _id: event_ids[i] });
        doc
          .fontSize(7)
          .font("./Montserrat/static/Montserrat-Bold.ttf")
          .text(event.name, 5, 120 + 20 * i, {
            width: 110,
            height: 20,
            valign: "center",
            align: "center",
          });
        doc.rect(5, 120 + 20 * i, 110, 20).stroke();
        break;
    }
  }
  //table border
  doc.rect(5, 120, 200, 172).stroke();

  //vertical line 1
  doc.moveTo(115, 120).lineTo(115, 260).stroke();
  //vertical line 2
  doc.moveTo(165, 120).lineTo(165, 292).stroke();

  //horizontal line
  doc.moveTo(5, 260).lineTo(205, 260).stroke();

  //note
  if (user.university && user.university !== "CVMU") {
    doc
      .fillColor("red")
      .fontSize(5)
      .font("./Montserrat/static/Montserrat-Bold.ttf")
      .text("Note : 18% GST is applied to all non - CVMU students", 10, 270, {
        width: 95,
        height: 20,
        valign: "center",
        align: "center",
      });
  }

  //total amount
  doc
    .fillColor("black")
    .fontSize(7)
    .font("./Montserrat/static/Montserrat-Bold.ttf")
    .text(amount + tax, 170, 273, {
      width: 30,
      height: 10,
      valign: "center",
      align: "center",
    });

  doc.end();
  setTimeout(() => {
    var file = fs.createReadStream(`./receipts/${transId}.pdf`);
    var stat = fs.statSync(`./receipts/${transId}.pdf`);
    res.setHeader("Content-Length", stat.size);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=receipt.pdf");
    file.pipe(res);
  }, 1000);
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/lead", leadRoute);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 8000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

//connecting to database
start();
