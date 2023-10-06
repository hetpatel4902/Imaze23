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

//routes user
app.get("/receipt", async (req, res) => {
  const {orderId,type} = req.query;

  const doc = new pdfkit({ size: "A7" });
  doc.pipe(fs.createWriteStream(`./receipts/receipt-${"pratham"}-${1234}.pdf`));
  doc.image(`./templates/LetterHead.jpg`, 0, 0, { width: 210, height: 300 });
  
  doc.rect(5,80,60,10).stroke();

  //table border
  doc.rect(5, 120, 200, 172).stroke();

  //vertical line 1
  doc.moveTo(115, 120).lineTo(115, 260).stroke();
  //vertical line 2
  doc.moveTo(165, 120).lineTo(165, 292).stroke();

  //horizontal line
  doc.moveTo(5, 260).lineTo(205, 260).stroke();

  doc.end();
  setTimeout(() => {
    var file = fs.createReadStream(
      `./receipts/receipt-${"pratham"}-${1234}.pdf`
    );
    var stat = fs.statSync(`./receipts/receipt-${"pratham"}-${1234}.pdf`);
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
