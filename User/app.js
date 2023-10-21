require("dotenv").config();
require("express-async-errors");

const express = require("express");
const cluster = require("cluster");
const os = require("os");
const app = express();

let numcpus = os.cpus().length;

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
const { StatusCodes } = require("http-status-codes");


app.use(express.static(`${__dirname}/public`));
app.use(express.json({ limit: "50mb" }));
app.use(helmet());
app.use(cors());
app.use(xss());

//routes user

app.use("/api/v1/user", userRouter);
app.use("/api/v1/lead", leadRoute);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 8000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    if(cluster.isMaster){
      for(let i =0;i<8;i++){
        cluster.fork();
      }
    }
    else{
      app.listen(port, () =>
        console.log(`${process.pid} Server is listening on port ${port}...`)
      );

    }
  } catch (error) {
    console.log(error);
  }
};

//connecting to database
start();
