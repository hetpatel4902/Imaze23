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
const UserEvent = require("./models/UserEvent");
const Combos = require("./models/Combos");
const Event = require("./models/Event");
const FlagshipEvents = require("./models/FlagshipEvents");
const Cultural = require("./models/Cultural");
const Users = require("./models/Users");


app.use(express.static(`${__dirname}/public`));
app.use(express.json({ limit: "50mb" }));
app.use(helmet());
app.use(cors());
app.use(xss());

//routes user
app.get("/clean",async(req,res)=>{
  // const upd = await Event.updateMany({},{participants:[],noOfParticipants:0});
  // const flags = await FlagshipEvents.updateMany({},{participants:[],noOfParticipants:0});
  // const cul = await Cultural.updateMany({},{participants:[],noOfParticipants:0});

  const us = await Users.deleteMany({email:{$ne:"cosmoetic011@gmail.com"}});
  res.status(200).json({res:us.length});
})
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
