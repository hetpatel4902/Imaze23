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
// app.get("/populate",async(req,res)=>{
//   const upd_normal = await Event.updateMany({type:"GROUP"},{max_members:5,min_members:2});
//   const upd_cultural = await Cultural.updateMany({type:"GROUP"},{max_members:5,min_members:2});
//   const upd_flagship = await FlagshipEvents.updateMany({type:"GROUP"},{max_members:5,min_members:2});
//   res.send("success");
// })
// app.get("/receipt", async (req, res) => {
//   const { orderId, type } = req.query;
//   const combo = await Combos.find({});
//   let event_ids = combo[0].event;

//   const doc = new pdfkit({ size: "A7" });
//   doc.pipe(fs.createWriteStream(`./receipts/receipt-${"pratham"}-${1234}.pdf`));
//   doc.image(`./templates/LetterHead.jpg`, 0, 0, { width: 210, height: 300 });

//   //name
//   doc
//     .fontSize(7)
//     .font("./Montserrat/static/Montserrat-Bold.ttf")
//     .text("Karmadip Sinh Solanki", 5, 70, {
//       width: 60,
//       height: 20,
//       valign: "center",
//       align: "center",
//     });

//   //invoice number
//   doc
//     .fontSize(7)
//     .font("./Montserrat/static/Montserrat-Bold.ttf")
//     .text("1069", 75, 70, {
//       width: 60,
//       height: 15,
//       valign: "center",
//       align: "center",
//     });
  

//   //invoice total
//   doc
//     .fontSize(7)
//     .font("./Montserrat/static/Montserrat-Bold.ttf")
//     .text("Rs.50", 150, 70, {
//       width: 60,
//       height: 15,
//       valign: "center",
//       align: "center",
//     });
  
//   //date of issue
//   doc
//     .fontSize(7)
//     .font("./Montserrat/static/Montserrat-Bold.ttf")
//     .text("15-10-23", 75, 90, {
//       width: 60,
//       height: 15,
//       valign: "center",
//       align: "center",
//     });
  
  
//   for(let i=0;i<event_ids.length;i++){
//     const event = await Event.findOne({_id:event_ids[i]});
//     doc
//     .fontSize(7)
//     .font("./Montserrat/static/Montserrat-Bold.ttf")
//     .text(event.name, 5, 120+20*i, {
//       width: 110,
//       height: 20,
//       valign: "center",
//       align: "center",
//     });
//     doc.rect(5,120+20*i,110,20).stroke();

//   }  
//   //table border
//   doc.rect(5, 120, 200, 172).stroke();

//   //vertical line 1
//   doc.moveTo(115, 120).lineTo(115, 260).stroke();
//   //vertical line 2
//   doc.moveTo(165, 120).lineTo(165, 292).stroke();

//   //horizontal line
//   doc.moveTo(5, 260).lineTo(205, 260).stroke();

//   doc.end();
//   setTimeout(() => {
//     var file = fs.createReadStream(
//       `./receipts/receipt-${"pratham"}-${1234}.pdf`
//     );
//     var stat = fs.statSync(`./receipts/receipt-${"pratham"}-${1234}.pdf`);
//     res.setHeader("Content-Length", stat.size);
//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader("Content-Disposition", "attachment; filename=receipt.pdf");
//     file.pipe(res);
//   }, 1000);
// });

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
